import * as React from "react";
import { ImBlocked } from "react-icons/im";
import { FaCheck, FaEdit } from "react-icons/fa";
import { Button, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useGetNetworkConfig, useGetPendingTransactions } from "@multiversx/sdk-dapp/hooks";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers/out";
import { queryContract, } from "lib/queryContract";
import { AllowedTokenContext } from "lib/DappContexts";
import { OwnerButton, OwnerOrOperatorButton } from "components/AdminButton";
import { freeze_sc, unfreeze_sc } from "lib/transactions";
import { EpochChangeModal } from "./EpochChangeModal";
import { AllowedTokenChangeModal } from "./AllowedTokenChangeModal";
interface Configuration {
  frozen: boolean;
  listinEpoch: number;
  currentEpoch: number;
}

export const ContractConfiguration = () => {
  const [contractConfiguration, setContractConfiguration] =
    useState<Configuration>({
      frozen: true,
      listinEpoch: 0,
      currentEpoch: 0,
    });
  const vestedToken = React.useContext(AllowedTokenContext);  
  const { network } = useGetNetworkConfig();
  const provider = new ApiNetworkProvider(network.apiAddress);


  const loadConfigurationData = async () => {
    const newConfiguracionData: Configuration = {
      frozen: true,
      listinEpoch: 0,
      currentEpoch: 0,
    };
    
    const frozenStateData = await queryContract("frozen", network);
    if (frozenStateData.firstValue) {
      newConfiguracionData.frozen = frozenStateData.firstValue?.valueOf().name == "Unfrozen" ? false : true;
    }

    const listingEpochData = await queryContract("get_listing_epoch", network);
    if (listingEpochData.firstValue) {
      newConfiguracionData.listinEpoch = listingEpochData.firstValue?.valueOf().toString(10);
    }

    newConfiguracionData.currentEpoch = (await provider.doGetGeneric("stats/")).epoch;
    
    setContractConfiguration(newConfiguracionData);
  };
  const {hasPendingTransactions} = useGetPendingTransactions();

  useEffect(() => {
    loadConfigurationData();
  }, [hasPendingTransactions]);


  return (
    <Row data-testid="topInfo">
      <Col sm={12} md={4}>
        <p className="ml-2">
          {contractConfiguration.frozen && (
            <>
              Contract <strong>Frozen</strong>{" "}
              <OwnerButton title="Unfreeze"
              onClick={(e:any) => {unfreeze_sc()}}>
                <FaCheck />
              </OwnerButton>
            </>
          )}
          {!contractConfiguration.frozen && (
            <>
              Contract <strong>Unfrozen</strong>{" "}
              <OwnerOrOperatorButton title="Freeze"
              onClick={(e:any) => {freeze_sc()}}>
                <ImBlocked />
              </OwnerOrOperatorButton>
            </>
          )}
        </p>
      </Col>
      <Col sm={12} md={4}>
        <p className="ml-2">
          Listing epoch <strong>{contractConfiguration.listinEpoch}</strong>{" "}
          (current epoch {contractConfiguration.currentEpoch}){" "}
          <EpochChangeModal currentListingEpoch={contractConfiguration.listinEpoch} />
        </p>
      </Col>
      <Col sm={12} md={4}>
        <p className="ml-2">
          Allowed token <strong>{vestedToken.id}</strong>{" "}
          <AllowedTokenChangeModal currentAllowedToken={vestedToken.id}/>
        </p>
      </Col>
    </Row>
  );
};
