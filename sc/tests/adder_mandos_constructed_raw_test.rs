use elrond_wasm_debug::{mandos_system::model::*, *};

fn world() -> BlockchainMock {
    let mut blockchain = BlockchainMock::new();
    blockchain.set_current_dir_from_workspace("contracts/examples/vesting");

    blockchain.register_contract_builder("file:output/vesting.wasm", vesting::ContractBuilder);
    blockchain
}

#[test]
fn vesting_mandos_constructed_raw() {
    let mut world = world();
    let ic = world.interpreter_context();
    world
        .mandos_set_state(
            SetStateStep::new()
                .put_account("address:owner", Account::new().nonce(1))
                .new_address("address:owner", 1, "sc:vesting"),
        )
        .mandos_sc_deploy(
            ScDeployStep::new()
                .from("address:owner")
                .contract_code("file:output/vesting.wasm", &ic)
                .argument("5")
                .gas_limit("5,000,000")
                .expect(TxExpect::ok().no_result()),
        )
        .mandos_sc_query(
            ScQueryStep::new()
                .to("sc:vesting")
                .function("getSum")
                .expect(TxExpect::ok().result("5")),
        )
        .mandos_sc_call(
            ScCallStep::new()
                .from("address:owner")
                .to("sc:vesting")
                .function("add")
                .argument("3")
                .expect(TxExpect::ok().no_result()),
        )
        .mandos_check_state(
            CheckStateStep::new()
                .put_account("address:owner", CheckAccount::new())
                .put_account(
                    "sc:vesting",
                    CheckAccount::new().check_storage("str:sum", "8"),
                ),
        );
}
