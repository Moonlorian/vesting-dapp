import * as React from "react";
import { useEffect, useState } from "react";
import { FormatAmount } from "@multiversx/sdk-dapp/UI";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { useGetNetworkConfig } from "@multiversx/sdk-dapp/hooks/useGetNetworkConfig";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";
import { Address } from "@multiversx/sdk-core";
import { AllowedTokenContext } from "lib/DappContexts";
import { contractAddress } from "config/config";
import { queryContract } from "lib/queryContract";
import { AddFundsModal } from "./AddFundsModal";

export const ContractFunds = () => {
  const [vestedTokenBalance, setVestedTokenBalance] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [neededAmount, setNeededAmount] = useState<BigNumber>(new BigNumber(0));
  const [countedAddresses, setCountedAddresses] = useState(0);
  const vestedToken = React.useContext(AllowedTokenContext);
  const { network } = useGetNetworkConfig();

  const getContractBalance = async () => {
    if (vestedToken.id == "") return;
    const provider = new ApiNetworkProvider(network.apiAddress);
    const data = await provider.getFungibleTokenOfAccount(
      new Address(contractAddress),
      vestedToken.id
    );
    setVestedTokenBalance(data.balance);
  };

  const getNeededBalance = async () => {
    const totalAmountData = await queryContract(
      "get_total_vested_supply",
      network
    );
    if (totalAmountData.firstValue) {
      setNeededAmount(totalAmountData.firstValue?.valueOf());
    }
  };

  const getAddressed_count = async () => {
    const totalAmountData = await queryContract("get_count_addresses", network);
    if (totalAmountData.firstValue) {
      setCountedAddresses(totalAmountData.firstValue?.valueOf().toFixed(0));
    }
  };

  useEffect(() => {
    getContractBalance();
  }, [vestedToken]);

  useEffect(() => {
    getNeededBalance();
    getAddressed_count();
  }, []);

  return (
    <>
      <div
        className="d-flex justify-content-evenly text-end mt-3"
        data-testid="topInfo"
      >
        <div className="pt-2">
          <span className="opacity-6 mr-1">
            Addresses counted:<strong>{countedAddresses}</strong>
          </span>
        </div>
      </div>
      <div
        className="d-flex justify-content-evenly text-end mt-3"
        data-testid="topInfo"
      >
        <div className="pt-2">
          <span className="opacity-6 mr-1">Balance:</span>
          <FormatAmount
            value={vestedTokenBalance.toFixed(0)}
            token={vestedToken.name}
            egldLabel={vestedToken.name}
            decimals={vestedToken.decimals}
            digits={0}
            data-testid="balance"
          />
        </div>
        <div className="pt-2">
          <span className="opacity-6 mr-1">Needed amount:</span>
          <FormatAmount
            value={neededAmount.toFixed(0)}
            token={vestedToken.name}
            egldLabel={vestedToken.name}
            decimals={vestedToken.decimals}
            digits={0}
            data-testid="balance"
            className={
              neededAmount.isGreaterThan(vestedTokenBalance)
                ? "text-danger"
                : ""
            }
          />
        </div>
        <div className="">
          <AddFundsModal />
        </div>
      </div>
    </>
  );
};
