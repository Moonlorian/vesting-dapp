import React, { useEffect, useState } from "react";
import { AuthenticatedRoutesWrapper } from "@multiversx/sdk-dapp/wrappers";
import { useLocation } from "react-router-dom";
import { routes, routeNames } from "routes";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ReactComponent as Header_bottom } from "../../assets/img/header_bottom.svg";
import { contractAddress, dAppName } from "config/config";
import {
  AllowedTokenContext,
  VestedTokenType,
  AuthorizedWalletContext,
  AuthorizedWalletType,
} from "lib/DappContexts";
import {
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "@multiversx/sdk-dapp/hooks";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { queryContract } from "lib/queryContract";
import { Address } from "@multiversx/sdk-core/out";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [vestedToken, setVestedToken] = useState<VestedTokenType>({
    id: "",
    name: "",
    decimals: 0,
  });

  const [contractWallets, setContractWallets] = useState<AuthorizedWalletType>({
    owner: "",
    operator: "",
  });

  //const { address } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  const provider = new ApiNetworkProvider(network.apiAddress);
  const { search } = useLocation();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const loadContractData = async () => {
    //Load contract wallets:
    const newContractWallets: AuthorizedWalletType = {
      owner: "",
      operator: "",
    };
    newContractWallets.owner = (
      await provider.doGetGeneric("accounts/" + contractAddress)
    ).ownerAddress;
    const operatorData = await queryContract("get_operator_address", network);
    if (operatorData.firstValue) {
      const benchAddress = operatorData.firstValue?.valueOf();
      const operatorAddressObject = new Address(benchAddress);
      newContractWallets.operator = operatorAddressObject.toString();
    }
    setContractWallets(newContractWallets);
  };

  const loadTokenData = async () => {
    //Load allowed token
    const allowedTOkenData = await queryContract("get_vested_token", network);
    if (allowedTOkenData.firstValue) {
      const fullTokenData = await provider.getDefinitionOfFungibleToken(
        allowedTOkenData.firstValue?.valueOf()
      );
      const newTokenData = {
        id: allowedTOkenData.firstValue?.valueOf(),
        name: fullTokenData.name,
        decimals: fullTokenData.decimals,
      };
      setVestedToken(newTokenData);
    }
  };

  useEffect(() => {
    loadContractData();
  }, [hasPendingTransactions]);

  useEffect(() => {
    loadTokenData();
  }, [hasPendingTransactions, contractWallets]);

  return (
    <AllowedTokenContext.Provider value={vestedToken}>
      <AuthorizedWalletContext.Provider value={contractWallets}>
        <div className="d-flex flex-column flex-fill wrapper">
          <header>
            <Navbar />
            <div className="container">
              <div className="row">
                <div className="position-relative col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                  <h1 className="text-center text-white font-60 mb-4 px-md-15 px-lg-0 bold">
                    <span className="underline-3 style-2 yellow">
                      {dAppName}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
            <div className="overflow-hidden d-block">
              <div className="divider text-light mx-n2">
                <Header_bottom />
              </div>
            </div>
          </header>
          <main className="d-flex flex-column flex-grow-1">
            <AuthenticatedRoutesWrapper
              routes={routes}
              unlockRoute={`${routeNames.unlock}${search}`}
            >
              {children}
            </AuthenticatedRoutesWrapper>
          </main>
          <Footer />
        </div>
      </AuthorizedWalletContext.Provider>
    </AllowedTokenContext.Provider>
  );
};
