import React from "react";
import { Button } from "react-bootstrap";
import { AuthorizedWalletContext } from "lib/DappContexts";
import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";

const AdminButton = ({ children, ...props }: { children: React.ReactNode }) => {
  return <Button {...props}>{children}</Button>;
};

export const OwnerButton = (props: any) => {
  const { address } = useGetAccountInfo();
  const importantAddresses = React.useContext(AuthorizedWalletContext);
  const propsDisabled = props?.disabled;
  const buttonDisabled = address == importantAddresses.owner ? false : true;
  
  return (
    <AdminButton disabled={propsDisabled || buttonDisabled} {...props}>
      {props?.children}
    </AdminButton>
  );
};

export const OwnerOrOperatorButton = (props: any) => {
  const { address } = useGetAccountInfo();
  const importantAddresses = React.useContext(AuthorizedWalletContext);
  const propsDisabled = props?.disabled;
  const buttonDisabled = (address == importantAddresses.operator || address == importantAddresses.owner) ? false : true;
  
  return (
    <OwnerButton disabled={propsDisabled || buttonDisabled} {...props}>
      {props?.children}
    </OwnerButton>
  );
};
