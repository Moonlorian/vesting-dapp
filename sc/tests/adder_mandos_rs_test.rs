use elrond_wasm_debug::*;

fn world() -> BlockchainMock {
    let mut blockchain = BlockchainMock::new();
    blockchain.set_current_dir_from_workspace("");

    blockchain.register_contract_builder("file:output/vesting.wasm", vesting::ContractBuilder);
    blockchain
}

#[test]
fn vesting_rs() {
    elrond_wasm_debug::mandos_rs("mandos/add_funds.scen.json", world());
}
