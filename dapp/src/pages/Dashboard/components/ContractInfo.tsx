import * as React from "react";
import { contractAddress } from "config/config";
import { FormatedAddress } from "../../../components/FormatedAddress";
import { AuthorizedWalletContext } from "lib/DappContexts";
import { ContractFunds } from "./ContractFunds/ContractFunds";

export const ContractInfo = () => {
  const importantAddresses = React.useContext(AuthorizedWalletContext);
  
  return (
    <div className="mt-2" data-testid="topInfo">
      <div className="mb-1">
        <span className="opacity-6 mr-1">Contract:</span>
        <FormatedAddress address={contractAddress} />
      </div>
      <div className="mb-1">
        <span className="opacity-6 mr-1">Owner:</span>
        {importantAddresses.owner != "" && (
          <>
            <FormatedAddress address={importantAddresses.owner} />
          </>
        )}
      </div>
      <div className="mb-1">
        <span className="opacity-6 mr-1">Operator:</span>
        {importantAddresses.operator != "" && (
          <>
          <FormatedAddress address={importantAddresses.operator} />
          </>
        )}
      </div>
      <ContractFunds />
    </div>
  );
};
