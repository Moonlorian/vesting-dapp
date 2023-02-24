elrond_wasm::imports!();
elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, PartialEq, TypeAbi, Debug)]
pub enum State {
    Unfrozen = 0,
    Frozen = 1
}

#[elrond_wasm::module]
pub trait FrozenState:crate::operator::Operator {

    //storage
    #[view(frozen)]
    #[storage_mapper("frozen")]
    fn frozen(&self) -> SingleValueMapper<State>;

    //endpoint
    #[endpoint]
    fn freeze_sc(&self) {
        self.validate_owner_or_operator();
        self.frozen().set(&State::Frozen);
    }

    #[only_owner]
    #[endpoint]
    fn unfreeze_sc(&self) {
        self.frozen().set(&State::Unfrozen);
    }


    fn check_is_frozen(&self){
        require!(self.frozen().get() == State::Frozen, "Contract is not frozen");
    }

    fn check_is_not_frozen(&self){
        require!(self.frozen().get() == State::Unfrozen, "Contract is stopped, operation not allowed right now");
    }

}