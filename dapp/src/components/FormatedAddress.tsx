import * as React from "react";
import { CopyButton } from "@multiversx/sdk-dapp/UI/CopyButton";
import { ExplorerLink } from "@multiversx/sdk-dapp/UI";

export const FormatedAddress = ({ address }: { address: string }) => {
  const cutWallet = (wallet: string) =>
    wallet.substring(0, 8) +
    "..." +
    wallet.substring(wallet.length - 8, wallet.length);
  return (
    <span data-testid="accountAddress">
      {" "}
      {cutWallet(address)} <CopyButton text={address} />{" "}
      <ExplorerLink page={"/accounts/" + address} />
    </span>
  );
};
