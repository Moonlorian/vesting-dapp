import React from "react";

export interface VestedTokenType {
  id: string;
  name: string;
  decimals: number;
}
const emptyVestedToken = () => {
  return(
    {
      id: "",
      name: "",
      decimals: 0,
    }   
  );
}
export const AllowedTokenContext = React.createContext<VestedTokenType>(emptyVestedToken());

export interface AuthorizedWalletType {
  owner: string;
  operator: string;
}
const emptyAuthorizedWallet = () => {
  return(
    {
      owner: "",
      operator: "",
    }   
  );
}
export const AuthorizedWalletContext = React.createContext<AuthorizedWalletType>(emptyAuthorizedWallet());
