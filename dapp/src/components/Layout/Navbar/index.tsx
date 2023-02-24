import React from "react";
import { useGetAccount, useGetIsLoggedIn } from "@multiversx/sdk-dapp/hooks";
import { logout } from "@multiversx/sdk-dapp/utils";
import { Navbar as BsNavbar, NavItem, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { routeNames } from "routes";
import { brand, dAppName } from "config/config";
import { AuthorizedWalletContext } from "lib/DappContexts";

export const Navbar = () => {
  const isLoggedIn = useGetIsLoggedIn();
  const { address } = useGetAccount();

  const contractWallets = React.useContext(AuthorizedWalletContext);

  const navigate = useNavigate();


  const handleLogout = () => {
    logout(`${window.location.origin}`);
  };

  return (
    <BsNavbar className="px-4 py-3">
      <div className="container-fluid">
        <Link
          className="d-flex align-items-center navbar-brand mr-0"
          to={routeNames.home}
        >
          <span className="dapp-name text-white">{brand}</span>
        </Link>

        <Nav className="ml-auto">
          {isLoggedIn && (
            <>
              {(contractWallets.operator === address ||
                contractWallets.owner === address) && (
                <NavItem>
                  <button
                    className="text-white btn btn-link"
                    onClick={ (e:any) => navigate('/dashboard')}
                  >
                    Admin
                  </button>
                </NavItem>
              )}
              <NavItem>
                <button
                  className="text-white btn btn-link"
                  onClick={handleLogout}
                >
                  Close
                </button>
              </NavItem>
            </>
          )}
        </Nav>
      </div>
    </BsNavbar>
  );
};
