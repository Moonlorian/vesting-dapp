elrond_wasm::imports!();

use crate::custom_types::*;

#[elrond_wasm::module]
pub trait StorageModule: {

    #[view(get_listing_epoch)]
    #[storage_mapper("listing_epoch")]
    fn listing_epoch(&self) -> SingleValueMapper<u64>;

    #[view(get_vested_token)]
    #[storage_mapper("vested_token")]
    fn vested_token(&self) -> SingleValueMapper<EgldOrEsdtTokenIdentifier>;

    #[view(get_categories)]
    #[storage_mapper("categories")]
    fn categories(&self) -> MapMapper<ManagedBuffer, CategoryType>;
    
    #[view(get_unlock_data_list)]
    #[storage_mapper("unlock_data_list")]
    fn unlock_data_list(&self, category:&ManagedBuffer) -> SingleValueMapper<ManagedVec<UnlockData>>;

    #[view(get_category_addresses)]
    #[storage_mapper("category_addresses")]
    fn category_addresses(&self, category:&ManagedBuffer) -> UnorderedSetMapper<ManagedAddress>;

    #[view(get_category_address_balance)]
    #[storage_mapper("category_address_balance")]
    fn category_address_balance(&self, category:&ManagedBuffer, address:&ManagedAddress) -> SingleValueMapper<AddressBalance<Self::Api>>;

    #[view(get_total_vested_supply)]
    #[storage_mapper("total_vested_supply")]
    fn total_vested_supply(&self) -> SingleValueMapper<BigUint>;


}