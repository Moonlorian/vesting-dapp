elrond_wasm::imports!();

elrond_wasm::derive_imports!();

#[derive(TopEncode, TopDecode, TypeAbi, PartialEq)]
pub struct CategoryType{
    pub unlock_epoch:u64,
    pub period:u64,
    pub percent:u32
}

#[derive(NestedEncode, NestedDecode, TopEncode,TopDecode, TypeAbi,PartialEq, Clone)]
pub struct AddressBalance<M: ManagedTypeApi> {
    pub initial_amount: BigUint<M>,
    pub claimed_amount: BigUint<M>,
}

#[derive(ManagedVecItem, NestedEncode, NestedDecode, TopEncode, TopDecode, TypeAbi, Clone)]
pub struct UnlockData {
    pub epoch: u64,
    pub percent: u32
}

#[derive(NestedEncode, NestedDecode, TopEncode,TopDecode, TypeAbi,PartialEq, Clone)]
pub struct TotalAddressBalance<M: ManagedTypeApi> {
    pub initial_amount: BigUint<M>,
    pub unlocked_amount: BigUint<M>,
    pub claimed_amount: BigUint<M>,
}
