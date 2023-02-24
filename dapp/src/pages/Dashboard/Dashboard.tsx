import React from "react";
import { ContractInfo } from "./components/ContractInfo";
import { BalanceInfo } from "./components/BalanceInfo";
import Card from "react-bootstrap/Card";
import { ContractConfiguration } from "./components/ContractConfiguration/ContractConfiguration";
import { Categories } from "./components/Categories/Categories";
import { useGetAccount, useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks";
import { AuthorizedWalletContext } from "lib/DappContexts";
import { Navigate } from "react-router-dom";
import { routeNames } from "routes";

export const Dashboard = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();
  const contractWallets = React.useContext(AuthorizedWalletContext);

  const redirectToHome = () => {
    if (isLoggedIn && !(
      contractWallets.operator === address ||
      contractWallets.owner === address
    ) && (contractWallets.operator + contractWallets.owner) !== ""){
      return(true);
    }
    return(false);
  }

  return (
    <>
      {redirectToHome()  && <Navigate to={routeNames.home} />}
      <div className="container py-4">
        <div className="row">
          <div className="col-12 col-md-6 mx-auto mt-4">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-1">
                <Card className="border-0">
                  <Card.Body className="p-1 text-center p-4">
                    <Card.Title>Contract Info</Card.Title>
                    <ContractInfo />
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-md-6 x-auto mt-4">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-1">
                <Card className="border-0">
                  <Card.Body className="p-1 text-center p-4">
                    <Card.Title>Your balances</Card.Title>
                    <BalanceInfo />
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mx-auto mt-4">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-1">
                <Card className="border-0">
                  <Card.Body className="p-1 text-center p-4">
                    <Card.Title>Vesting contract configuration</Card.Title>
                    <ContractConfiguration />
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mx-auto mt-4">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-1">
                <Card className="border-0">
                  <Card.Body className="p-1 text-center p-4">
                    <Card.Title>Vesting Categories</Card.Title>
                    <Categories />
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
