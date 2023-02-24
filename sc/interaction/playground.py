import logging
from argparse import ArgumentParser
from pathlib import Path

from erdpy import config
from erdpy.accounts import Account
from erdpy.contracts import SmartContract
from erdpy.projects import ProjectRust
from erdpy.proxy import ElrondProxy

logger = logging.getLogger("examples")

if __name__ == '__main__':
    """parser = ArgumentParser()
    parser.add_argument("--proxy", help="Proxy URL", default=config.get_proxy())
    parser.add_argument("--contract", help="Existing contract address")
    parser.add_argument("--pem", help="PEM file", required=True)
    args = parser.parse_args()
    """

    logging.basicConfig(level=logging.INFO)
    proxyStr = "https://devnet-gateway.elrond.com"
    #proxy = ElrondProxy(args.proxy)
    proxy = ElrondProxy(proxyStr)
    network = proxy.get_network_config()
    chain = network.chain_id
    gas_price = network.min_gas_price
    tx_version = network.min_tx_version

    #user = Account(pem_file=args.pem)
    user = Account(pem_file="../wallet/pemFile.pem")

    project = ProjectRust(Path(__file__).parent.parent)
    bytecode = project.get_bytecode()

    # We initialize the smart contract with an actual address if IF was previously deployed,
    # so that we can start to interact with it ("query_flow")
    #contract = SmartContract(address=args.contract)
    contract = SmartContract("erd1qqqqqqqqqqqqqpgqlhmlvm0d9n4sjd3tuxprlgxrv30lamj84xfqznf8af")

    def deploy_flow():
        global contract

        # For deploy, we initialize the smart contract with the compiled bytecode
        contract = SmartContract(bytecode=bytecode)

        tx = contract.deploy(
            owner=user,
            arguments=[0x45474c44],
            gas_price=gas_price,
            gas_limit=50000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_on_network = tx.send_wait_result(proxy, 5000)

        logger.info("Tx hash: %s", tx_on_network.get_hash())
        logger.info("Contract address: %s", contract.address.bech32())
    
    #VESTED_TOKEN
    def get_vested_token():
        answer = contract.query(proxy, "get_vested_token", [])
        logger.info(f"Answer: {answer}")
    def set_vested_token(tokenName):
        tx = contract.execute(
            caller=user,
            function="add",
            arguments=[tokenName],
            gas_price=gas_price,
            gas_limit=50000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_hash = tx.send(proxy)
        logger.info("Tx hash: %s", tx_hash)

    #LISTING
    def get_listing_epoch():
        answer = contract.query(proxy, "get_listing_epoch", [])
        logger.info(f"Answer: {answer}")
    def set_listing_epoch(initialEpoch):
        tx = contract.execute(
            caller=user,
            function="set_listing_epoch",
            arguments=[initialEpoch],
            gas_price=gas_price,
            gas_limit=50000000,
            value=0,
            chain=chain,
            version=tx_version
        )

        tx_hash = tx.send(proxy)
        logger.info("Tx hash: %s", tx_hash)

    #user.sync_nonce(ElrondProxy(args.proxy))
    user.sync_nonce(ElrondProxy(proxyStr))

    while True:
        print("Let's run a flow.")
        print("1. Deploy")
        print("2. Query get_vested_token()")
        print("3. set allowed token")
        print("4. get initial epoch")
        print("5. set initial epoch")


        try:
            choice = int(input("Choose:\n"))
        except Exception:
            break

        if choice == 1:
            #deploy_flow()
            print('for security reasons deploy is commented')
            user.nonce += 1
        elif choice == 2:
            get_vested_token()
        elif choice == 3:
            tokenName = int(input("Enter token:"))
            set_vested_token(tokenName)
            user.nonce += 1
        elif choice == 4:
            get_listing_epoch()
        elif choice == 5:
            initialEpoch = int(input("Enter initial epoch:"))
            set_listing_epoch(initialEpoch)
            user.nonce += 1
