elrond_wasm::imports!();

#[elrond_wasm::module]
pub trait Operator {

    #[view(get_operator_address)]
    #[storage_mapper("operator")]
    fn operator(&self) -> SingleValueMapper<ManagedAddress>;

    //endpoint
    #[only_owner]
    #[endpoint]
    fn set_operator_address(&self, new_operator:ManagedAddress){
        require!(self.operator().is_empty(), "Current operator is not empty. Clean it before set.");
        self.operator().set(&new_operator);
    }

    #[only_owner]
    #[endpoint]
    fn clear_operator_address(&self){
        self.operator().clear();
    }

    //private functions
    fn validate_owner_or_operator(&self){
        let caller = self.blockchain().get_caller();
        require!( (
            (caller == self.blockchain().get_owner_address()) ||
            (caller == self.operator().get())
        ), "Address not allowed." );
    }

}