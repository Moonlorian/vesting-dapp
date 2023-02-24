import * as React from "react";
import { Link } from "react-router-dom";
import { dAppName } from "config/config";
import { routeNames } from "routes";
import {
  useGetAccount,
  useGetIsLoggedIn,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "@multiversx/sdk-dapp/hooks";
import { AllowedTokenContext } from "lib/DappContexts";
import { FormatAmount } from "@multiversx/sdk-dapp/UI";
import { queryContract } from "lib/queryContract";
import { Address, AddressValue } from "@multiversx/sdk-core/out";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";
import { claim } from "lib/transactions";

export interface VestedBalanceType {
  totalAmount: BigNumber;
  unlockedAmount: BigNumber;
  claimedAmount: BigNumber;
}

const voidVestedBalance = {
  totalAmount: new BigNumber(0),
  unlockedAmount: new BigNumber(0),
  claimedAmount: new BigNumber(0),
};

export const Home = () => {
  const [vestedBalance, setVestedBalance] =
    React.useState<VestedBalanceType>(voidVestedBalance);
  const isLoggedIn = useGetIsLoggedIn();
  const vestedToken = React.useContext(AllowedTokenContext);

  const { network } = useGetNetworkConfig();
  const { address, balance } = useGetAccount();
  const { hasPendingTransactions } = useGetPendingTransactions();
  
  const loadVestedBalance = async () => {
    if (!isLoggedIn) return;

    const categoryAddressList = await queryContract(
      "get_address_balance",
      network,
      [new AddressValue(new Address(address))]
    );
    if (categoryAddressList.firstValue) {
      const newVestedBalance: VestedBalanceType = { ...voidVestedBalance };
      const balanceData = categoryAddressList.firstValue?.valueOf();
      newVestedBalance.totalAmount = new BigNumber(balanceData[0].toString(10));
      newVestedBalance.unlockedAmount = new BigNumber(balanceData[1].toString(10));
      newVestedBalance.claimedAmount = new BigNumber(balanceData[2].toString(10));
      setVestedBalance(newVestedBalance);
    }
  };

  React.useEffect(() => {
    loadVestedBalance();
  }, [isLoggedIn, hasPendingTransactions]);

  return (
    <div className="d-flex flex-fill align-items-center container">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              {!isLoggedIn && (
                <>
                  <h2 className="mb-3" data-testid="title">
                    {dAppName}
                  </h2>

                  <p className="mb-3">
                    {dAppName}
                    <br /> Login using your MultiversX wallet.
                  </p>

                  <Link
                    to={routeNames.unlock}
                    className="btn btn-primary mt-3 text-white"
                    data-testid="loginBtn"
                  >
                    Login
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <>
                  <div className="mt-4 justify-content-center row">
                    <div className="mt-2 col-lg-3 col-md-5">
                      <div className="balance-card">
                        <h4>Total EGLD Balance</h4>
                        <p>
                          <FormatAmount value={balance.toString()} />
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 col-lg-6 col-md-7">
                      <div className="d-flex balance-card flex-row justify-content-between">
                        <div className="text-center col-6">
                          <h4>Total {vestedToken.name} Locked</h4>
                          <p>
                            {" "}
                            <FormatAmount
                              value={vestedBalance.totalAmount.toFixed()}
                              token={vestedToken.name}
                              egldLabel={vestedToken.name}
                              decimals={vestedToken.decimals}
                              digits={0}
                              data-testid="balance"
                            />
                          </p>
                        </div>
                        <div className="text-center col-6">
                          <h4>Total {vestedToken.name} Claimed</h4>
                          <p>
                            {" "}
                            <FormatAmount
                              value={vestedBalance.claimedAmount.toFixed()}
                              token={vestedToken.name}
                              egldLabel={vestedToken.name}
                              decimals={vestedToken.decimals}
                              digits={0}
                              data-testid="balance"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 justify-content-center row">
                    <div className="mt-2 col-lg-5 col-md-4">
                      <div className="balance-card">
                        <h4>Your unlocked {vestedToken.name} to claim</h4>
                        <p className="mb-2">
                          <FormatAmount
                            value={vestedBalance.unlockedAmount.toFixed()}
                            token={vestedToken.name}
                            egldLabel={vestedToken.name}
                            decimals={vestedToken.decimals}
                            digits={0}
                            data-testid="balance"
                          />
                        </p>
                        <button
                          type="button"
                          disabled={vestedBalance.unlockedAmount.isLessThanOrEqualTo(0)}
                          className="btn btn-gold small"
                          onClick={(e:any) => claim()}
                        >
                          <span>Claim</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
