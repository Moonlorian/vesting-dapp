import * as React from "react";
import { useEffect, useState } from "react";
import { useGetAccount, useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { FormatAmount } from "@multiversx/sdk-dapp/UI";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";
import { Address } from "@multiversx/sdk-core";
import { AllowedTokenContext } from "lib/DappContexts";
import { FormatedAddress } from "../../../components/FormatedAddress";

export const BalanceInfo = () => {
  const [vestedTokenBalance, setVestedTokenBalance] = useState<BigNumber>(
    new BigNumber(0)
  );
  const vestedToken = React.useContext(AllowedTokenContext);
  const account = useGetAccount();
  const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();

  useEffect(() => {
    const provider = new ApiNetworkProvider(network.apiAddress);
    provider
      .getFungibleTokenOfAccount(new Address(account.address), vestedToken.id)
      .then((data) => {
        setVestedTokenBalance(data.balance);
      });
  }, [vestedToken]);

  return (
    <div className="text-end" data-testid="topInfo">
      <div className="mb-1">
        <span className="opacity-6 mr-1">Your address:</span>
        <FormatedAddress address={address} />
      </div>
      <div>
        <h3 className="">
          <FormatAmount value={account.balance} digits={0} data-testid="balance" />
        </h3>
      </div>
      <div>
        <h3 className="">
          <FormatAmount
            value={vestedTokenBalance.toFixed(0)}
            token={vestedToken.name}
            egldLabel={vestedToken.name}
            decimals={vestedToken.decimals}
            digits={0}
            data-testid="balance"
          />
        </h3>
      </div>
    </div>
  );
};
