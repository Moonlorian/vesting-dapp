import { AddressValue, StringValue, Address } from "@multiversx/sdk-core/out";
import {
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "@multiversx/sdk-dapp/hooks";
import { queryContract } from "lib/queryContract";
import * as React from "react";
import { Key, useEffect, useState } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import { AllowedTokenContext } from "lib/DappContexts";
import { ExplorerLink, FormatAmount, Loader } from "@multiversx/sdk-dapp/UI";
import { OwnerButton } from "components/AdminButton";
import { CopyButton } from "@multiversx/sdk-dapp/UI/CopyButton";
import { AddressChangeModal } from "./AddressChangeModal";
import { remove_user_address } from "lib/transactions";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";

export interface AddressType {
  address: string;
  totalAmount: BigNumber;
  claimedAmount: BigNumber;
}

const elementsPerPage = 10;

export const Addresses = ({ category, loadWallets }: any) => {
  const [addressList, setAddressList] = useState<AddressType[]>([
    {
      address: "",
      totalAmount: new BigNumber(0),
      claimedAmount: new BigNumber(0),
    },
  ]);
  const [loadingShape, setLoadingShape] = useState(true);
  const [page, setPage] = useState(0);
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();

  const loadBalances = async () => {
    if (!loadWallets) return;

    const categoryAddressList = await queryContract(
      "get_category_address_list_with_balance",
      network,
      [StringValue.fromUTF8(category)]
    );

    if (categoryAddressList.firstValue) {
      const newAddressList: AddressType[] = [];
      categoryAddressList.firstValue?.valueOf().map((element: any) => {
        newAddressList.push({
          address: new Address(element[0]).toString(),
          totalAmount: element[1].initial_amount,
          claimedAmount: element[1].claimed_amount,
        });
      });
      setLoadingShape(false);
      setAddressList(newAddressList);
    }
  };

  useEffect(() => {
    if (!loadWallets) {
      return;
    }

    loadBalances();
  }, [category, loadWallets, hasPendingTransactions]);

  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Row className="my-2">
        <Col>
          <AddressChangeModal
            categoryName={category}
            address={{
              address: "",
              totalAmount: new BigNumber(0),
              claimedAmount: new BigNumber(0),
            }}
          />
        </Col>
      </Row>
      <Card className="secondCard">
        {loadingShape ? (
          <div className="addressLoader">
            <Loader />
          </div>
        ) : (
          <AddressesList
            category={category}
            addressList={addressList}
            currentPage={page}
          />
        )}
      </Card>
      {addressList.length > elementsPerPage && (
        <Row className="mt-2">
          <Col>
            <div className="paginator">
              <Button
                className="m-2 font-16"
                disabled={page === 0 ? true : false}
                onClick={(e) => changePage(0)}
              >
                First
              </Button>
              <Button
                className="m-2 font-16"
                disabled={page === 0 ? true : false}
                onClick={(e) => changePage(page - 1)}
              >
                &lt; Previous
              </Button>
              <Button
                className="m-2 font-16"
                disabled={
                  page ===
                  Math.trunc((addressList.length - 1) / elementsPerPage)
                    ? true
                    : false
                }
                onClick={(e) => changePage(page + 1)}
              >
                Next &gt;
              </Button>
              <Button
                className="m-2 font-16"
                disabled={
                  page ===
                  Math.trunc((addressList.length - 1) / elementsPerPage)
                    ? true
                    : false
                }
                onClick={(e) =>
                  changePage(
                    Math.trunc((addressList.length - 1) / elementsPerPage)
                  )
                }
              >
                Last
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

const AddressesList = ({
  category,
  addressList,
  currentPage,
}: {
  category: string;
  addressList: AddressType[];
  currentPage: number;
}) => {
  const [page, setPage] = useState(0);

  const vestedToken = React.useContext(AllowedTokenContext);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  return (
    <Card.Body className={`p4`}>
      {addressList
        .slice(page * elementsPerPage, page * elementsPerPage + elementsPerPage)
        .map((address: AddressType, index: Key) => (
          <Row key={index}>
            <Col xs={12} md={7} className="text-left pt-3">
              {address.address} <CopyButton text={address.address} />{" "}
              <ExplorerLink page={"/accounts/" + address} />
            </Col>
            <Col xs={12} md={3} className="text-right pt-3">
              <FormatAmount
                value={address.totalAmount.toFixed()}
                token={vestedToken.name}
                egldLabel={vestedToken.name}
                decimals={vestedToken.decimals}
                digits={0}
                data-testid="balance"
              />
            </Col>
            <Col xs={12} md={2} className="text-right">
              <FormatAmount
                value={address.claimedAmount.toFixed()}
                token={vestedToken.name}
                egldLabel={vestedToken.name}
                decimals={vestedToken.decimals}
                digits={0}
                data-testid="balance"
              />
              <AddressChangeModal categoryName={category} address={address} />
              <OwnerButton
                onClick={(e: any) => {
                  e.stopPropagation();
                  remove_user_address(category, address.address);
                }}
              >
                <FaTrashAlt />
              </OwnerButton>
            </Col>
          </Row>
        ))}
    </Card.Body>
  );
};
