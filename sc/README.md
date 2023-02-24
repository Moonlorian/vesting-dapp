# Vesting Smart Contarct

```
[oo] ==> Only operator function
[ow] ==> Only owner function
[view] ==> Public view
[pay] ==> Payable function
```
## Freeze contract
Contract can be freezed:
- _[oo, ow]_ freeze_sc ==> Freeze contract
- _[ow]_ unfreeze_sc ==> Unfreeze contract
- _[view]_ frozen ==> Check frozen status


## Listing epoch
Listing epoch indicates epoch when vesting period started.
- _[ow]_ **set_listing_epoch**(_u64_ **listing_epoch** ) ==> Set listing epoch. Cannot be set before current epoch
- _[view]_ **get_listing_epoch** ==> Get setted listing epoch. Returns:
    - u64 ==> listing epoch

## Allowed token
Token to claim:
- _[ow]_ **set_vested_token**(_EgldOrEsdtTokenIdentifier_ **vested_token** ) ==> Set allowed token to add_funds function and claim function
- _[view]_ **vested_token** ==> Get current allowed token. Returns:
    - EgldOrEsdtTokenIdentifier ==> allowed token

## Categories
This sc accepts several category, each one containing a epochs period and a percentage to unlock in each period
- _[ow]- **configure_category**([_ManagedBuffer_ **name**, _u64_ **unlock_epoch**, _u64_ **epochs** , _u32_ **percentage** ]) ==> Creates or update a category. Epochs indicates number of epoch to next unlock period. First unlock period occurs inmediately in unlock_epoch. Next ones take place after a number of epoch period. Accepts several categories in one call.
- _[ow]_ **remove_category**(_ManagedBuffer_ **name** ) ==> Remove named cateogry.
- _[view]_ **get_categories** ==> Get full category list data. Returns:
    - ManagedBuffer ==> Category Name
    - u64 ==> unlock period
    - u64 ==> epoch period
    - u32 => unlock percentage
- _[view]_ **get_unlock_data_list**(_ManagedBuffer_ **category** ) ==> gets full unlock period list from a category. Returns:
    - ManagedVec:
        - u64 ==> next epoch sum to unlock
        - u32 ==> percentage to unlock

## Users address
Specify user address to each category
- _[ow]_ **set_address_balance**(_ManagedBuffer_ **category**, [_ManagedAddress_ **user_address**, _BigUint_ **total_locked_amount** ]) ==> Add one or more user address or update one or more. Accepts several user addresses and may add ones and update others.
- _[ow]_ **remove_address_from_category**(_ManagedBuffer_ **category_name**, _ManagedAddress_ **user_address** ) ==> Remove user data from a specified category.
- _[view]_ **get_category_addresses**(_ManagedBuffer_ **category_name**) ==> Get full address list from a category. Returns:
    - UnorderedSetMapper
        - ManagedAddress ==> User address
- _[view]_ **get_category_address_balance**(_ManagedBuffer_ **category_name**, _ManagedAddress_ **user_address**) ==> Gets current balance for a user address in a specified category. Returns:
    - BigUint ==> Iniital amount
    - BigUint ==> Claimed amount
- _[view]_ **get_address_balance**(_ManagedAddress_ **user_address**) ==> Gets full address balance by adding balance in each category. Returns:
    - BigUint ==> Iniital amount
    - BigUint ==> Unlocked amount
    - BigUint ==> Claimed amount

## Funds
Tokens inside sc
- _[ow, pay]_ **add_funds** ==> Call this passing an amount of allowed token to add funds to sc. Can be called multiple times to add more funds to sc.
- **claim** ==> send current unlocked amount of tokens for the wallet that made this call. 

