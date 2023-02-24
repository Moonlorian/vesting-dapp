#![no_std]

elrond_wasm::imports!();

pub mod custom_types;



use crate::custom_types::*;

pub mod frozen_state;
pub mod operator;
pub mod storage;

pub const HUNDRED: u32 = 10000u32;

#[elrond_wasm::contract]
pub trait Vesting:
    crate::storage::StorageModule + crate::operator::Operator + crate::frozen_state::FrozenState
{
    #[init]
    fn init(&self, vested_token: EgldOrEsdtTokenIdentifier) {
        self.vested_token().set_if_empty(&vested_token);
        self.total_vested_supply().set_if_empty(BigUint::zero());
    }

    //setters
    #[only_owner]
    #[endpoint]
    fn set_listing_epoch(&self, new_epoch: u64) {
        //Comented for testing
        self.check_listing_period_not_started();
        require!(
            self.blockchain().get_block_epoch() < new_epoch,
            "Listing epoch must be later than current"
        );
        self.listing_epoch().set(&new_epoch);
    }

    #[only_owner]
    #[endpoint]
    fn set_vested_token(&self, vested_token: EgldOrEsdtTokenIdentifier) {
        self.check_listing_period_not_started();
        self.vested_token().set(&vested_token);
    }

    //----------------------------
    //Catagories
    //----------------------------
    #[only_owner]
    #[endpoint]
    fn configure_category(
        &self,
        categories_list: MultiValueEncoded<MultiValue4<ManagedBuffer, u64, u64, u32>>,
    ) {
        self.check_listing_period_not_started();
        let categories_list_iterator = categories_list.into_iter();
        for category in categories_list_iterator {
            let category_tuple = category.into_tuple();
            let category_name = category_tuple.0;
            let unlock_epoch = category_tuple.1;
            let period = category_tuple.2;
            let percent = category_tuple.3;
            require!(
                percent <= 10000,
                "Unlock percent cannot be greater than 100%"
            );

            let number_of_periods = 10000 / percent;

            let period_difference = 10000 - (number_of_periods * percent);

            self.clean_unlock_data_list(&category_name);
            let mut unlock_data_list: ManagedVec<UnlockData> = Default::default();
            for period_index in 0..number_of_periods {
                let new_unlock_data = UnlockData {
                    epoch: (period_index as u64) * period,
                    percent: percent
                        + (if period_index + 1 == number_of_periods {
                            period_difference
                        } else {
                            0
                        }),
                };
                unlock_data_list.push(new_unlock_data);
            }

            self.unlock_data_list(&category_name).set(unlock_data_list);

            let new_category = CategoryType {
                unlock_epoch,
                period,
                percent,
            };
            self.categories().insert(category_name, new_category);
        }
    }

    #[only_owner]
    #[endpoint]
    fn remove_category(&self, category: ManagedBuffer) {
        self.check_listing_period_not_started();

        //Remove addresses and addresses balance asociated to this category
        let category_addresses = self.category_addresses(&category);
        let category_addresses_iterator = category_addresses.iter();
        for address in category_addresses_iterator {
            self.remove_addres_balance(&category, &address);
        }
        self.category_addresses(&category).clear();

        self.clean_unlock_data_list(&category);

        //Remove category
        self.categories().remove(&category);
    }

    //----------------------------
    //Addresses
    //----------------------------
    #[only_owner]
    #[endpoint]
    fn set_address_balance(
        &self,
        category: ManagedBuffer,
        addresses_list: MultiValueEncoded<MultiValue2<ManagedAddress, BigUint>>,
    ) {
        self.check_listing_period_not_started();
        require!(
            self.categories().contains_key(&category),
            "Selected category doesn't exist"
        );

        let mut total_supply = self.total_vested_supply().get();

        let adresses_iterator = addresses_list.into_iter();
        for address_data in adresses_iterator {
            let address_tuple = address_data.into_tuple();
            let address = address_tuple.0;
            let new_amount = address_tuple.1;
            let new_balance = AddressBalance {
                initial_amount: new_amount.clone(),
                claimed_amount: BigUint::zero(),
            };

            self.category_addresses(&category).insert(address.clone());
            let mut initial_user_amount = BigUint::zero();
            if !self
                .category_address_balance(&category, &address)
                .is_empty()
            {
                initial_user_amount = self
                    .category_address_balance(&category, &address)
                    .get()
                    .initial_amount;
            }
            total_supply += &new_amount - &initial_user_amount;
            self.category_address_balance(&category, &address)
                .set(new_balance);
        }
        self.total_vested_supply().set(total_supply);
    }

    #[only_owner]
    #[endpoint]
    fn remove_address_from_category(&self, category: ManagedBuffer, address: ManagedAddress) {
        self.check_listing_period_not_started();
        self.remove_addres_balance(&category, &address);
        self.category_addresses(&category).swap_remove(&address);
    }

    //We need an specific function to remove category/address balance only
    fn remove_addres_balance(&self, category: &ManagedBuffer, address: &ManagedAddress) {
        require!(
            !self
                .category_address_balance(&category, &address)
                .is_empty(),
            "Address not listed in this category."
        );

        let initial_user_amount = self
            .category_address_balance(&category, &address)
            .get()
            .initial_amount;

        self.total_vested_supply()
            .update(|total| *total -= &initial_user_amount);

        self.category_address_balance(&category, &address).clear();
    }

    //----------------------------
    //funding
    //----------------------------
    #[endpoint]
    #[payable("*")]
    fn add_funds(&self) {
        self.validate_owner_or_operator();
        let token = self.call_value().egld_or_single_fungible_esdt().0;
        require!(
            self.vested_token().get() == token,
            "This  token is not allowed"
        );
    }

    //----------------------------
    //claim
    //----------------------------
    #[endpoint]
    fn claim(&self) {
        let caller = self.blockchain().get_caller();
        let current_epoch = self.blockchain().get_block_epoch();

        let mut total_unlocked_amount = BigUint::zero();

        let category_list = self.categories();
        let categories_iterator = category_list.keys();
        for category_name in categories_iterator {
            if !self
                .category_address_balance(&category_name, &caller)
                .is_empty()
            {
                let category_address_balance =
                    self.category_address_balance(&category_name, &caller).get();
                let category_address_initial_amount = category_address_balance.initial_amount;
                let category_claimed_amount = category_address_balance.claimed_amount;
                let unlocked_amount = self.get_category_address_unlocked_amount(
                    current_epoch,
                    &category_name,
                    &category_address_initial_amount,
                );
                total_unlocked_amount += &unlocked_amount - &category_claimed_amount;

                self.category_address_balance(&category_name, &caller)
                    .set(AddressBalance {
                        initial_amount: category_address_initial_amount,
                        claimed_amount: unlocked_amount.clone(),
                    });
            }
        }

        require!(total_unlocked_amount > 0, "Nothing to claim");
        let token_balance = self.blockchain().get_esdt_balance(
            &self.blockchain().get_sc_address(),
            &self.vested_token().get().unwrap_esdt(),
            0,
        );
        require!(token_balance >= total_unlocked_amount, "Not enough balance");
        self.send().direct(
            &caller,
            &self.vested_token().get(),
            0,
            &total_unlocked_amount,
        );
    }

    //--------------------------------------
    // views
    //--------------------------------------
    #[view]
    fn get_address_balance(&self, address: &ManagedAddress) -> TotalAddressBalance<Self::Api> {
        let current_epoch = self.blockchain().get_block_epoch();

        let mut total_amount = BigUint::zero();
        let mut unlocked_amount = BigUint::zero();
        let mut claimed_amount = BigUint::zero();

        let category_list = self.categories();
        let categories_iterator = category_list.keys();
        for category_name in categories_iterator {
            if !self
                .category_address_balance(&category_name, address)
                .is_empty()
            {
                let category_address_initial_amount = self
                    .category_address_balance(&category_name, address)
                    .get()
                    .initial_amount;
                total_amount += &category_address_initial_amount;
                claimed_amount += &self
                    .category_address_balance(&category_name, address)
                    .get()
                    .claimed_amount;
                unlocked_amount += self.get_category_address_unlocked_amount(
                    current_epoch,
                    &category_name,
                    &category_address_initial_amount,
                );
            }
        }

        TotalAddressBalance {
            initial_amount: total_amount,
            unlocked_amount: &unlocked_amount - &claimed_amount,
            claimed_amount,
        }
    }

    #[view]
    fn get_category_address_list_with_balance(
        &self,
        category_name: &ManagedBuffer,
    ) -> MultiValueEncoded<MultiValue2<ManagedAddress, AddressBalance<Self::Api>>> {
        let mut addresses_balance_list = MultiValueEncoded::new();

        let category_address_list = self.category_addresses(&category_name);
        let category_address_iterator = category_address_list.iter();
        for address in category_address_iterator {
            let category_address_balance =
                self.category_address_balance(category_name, &address).get();
            addresses_balance_list.push((address, category_address_balance).into());
        }

        addresses_balance_list
    }

    #[view]
    fn get_count_addresses(&self) -> usize{
        let mut counted_addresses = 0usize;

        let category_list = self.categories();
        let categories_iterator = category_list.keys();
        for category_name in categories_iterator {
            counted_addresses += self.category_addresses(&category_name).len();
        }

        counted_addresses
    }
    //--------------------------------------
    fn check_listing_period_not_started(&self) {
        if !self.listing_epoch().is_empty() {
            require!(
                self.blockchain().get_block_epoch() < self.listing_epoch().get(),
                "Listing epoch has passed, operation not allowed."
            );
        }
    }

    fn get_category(&self, category_name: &ManagedBuffer) -> CategoryType {
        let category_opt = self.categories().get(category_name);
        match category_opt {
            Option::Some(category) => {
                return category;
            }
            Option::None => {
                panic!("Category doesn't exists");
            }
        }
    }

    fn clean_unlock_data_list(&self, category: &ManagedBuffer) {
        if !self.unlock_data_list(category).is_empty() {
            self.unlock_data_list(category).clear()
        }
    }

    fn get_category_address_unlocked_amount(
        self,
        current_epoch: u64,
        category_name: &ManagedBuffer,
        category_address_initial_amount: &BigUint,
    ) -> BigUint {
        let mut unlocked_amount = BigUint::zero();
        let category_unlock_data_list = self.unlock_data_list(category_name).get();
        let category_unlock_data_list_iterator = category_unlock_data_list.iter();
        let current_category = self.get_category(category_name);
        let initial_epoch = self.listing_epoch().get() + current_category.unlock_epoch;
        for unlock_data in category_unlock_data_list_iterator {
            if (initial_epoch + unlock_data.epoch) > current_epoch {
                break;
            } else {
                unlocked_amount +=
                    category_address_initial_amount * unlock_data.percent / &BigUint::from(HUNDRED);
            }
        }
        unlocked_amount
    }
}
