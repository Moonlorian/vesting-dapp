////////////////////////////////////////////////////
////////////////// AUTO-GENERATED //////////////////
////////////////////////////////////////////////////

#![no_std]

elrond_wasm_node::wasm_endpoints! {
    vesting
    (
        add_funds
        claim
        clear_operator_address
        configure_category
        freeze_sc
        frozen
        get_address_balance
        get_categories
        get_category_address_balance
        get_category_address_list_with_balance
        get_category_addresses
        get_count_addresses
        get_listing_epoch
        get_operator_address
        get_total_vested_supply
        get_unlock_data_list
        get_vested_token
        remove_address_from_category
        remove_category
        set_address_balance
        set_listing_epoch
        set_operator_address
        set_vested_token
        unfreeze_sc
    )
}

elrond_wasm_node::wasm_empty_callback! {}
