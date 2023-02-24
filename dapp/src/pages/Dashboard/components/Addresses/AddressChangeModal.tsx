import * as React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { OwnerButton } from "components/AdminButton";
import { update_user_address } from "lib/transactions";
import { AddressType } from "./Addresses";
import { AllowedTokenContext } from "lib/DappContexts";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";

export const AddressChangeModal = ({
  categoryName,
  address,
}: {
  categoryName: string;
  address: AddressType;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [addressWallet, setAddressWallet] = useState(address.address);
  const [addressTotalAmount, setTotalAmount] = useState(
    new BigNumber(address.totalAmount)
  );

  const vestedToken = React.useContext(AllowedTokenContext);

  React.useEffect(() => {
    setAddressWallet(address.address);
    setTotalAmount(new BigNumber(address.totalAmount));
  }, [address]);

  return (
    <>
      <OwnerButton
        className={`m-1 `}
        title="Add or update address"
        onClick={(e: any) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        {address.address !== "" ? <FaEdit /> : <>Add new address</>}
      </OwnerButton>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        onClick={(e: any) => e.stopPropagation()}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title>
            {address.address != "" ? "Update " : "Create new"} address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>User Address</Form.Label>
              <Form.Control
                value={addressWallet}
                onChange={(e: any) => {
                  setAddressWallet(e.target.value);
                }}
                disabled={address.address !== ""}
              />
              <Form.Label className="mt-3">Total locked amount</Form.Label>
              <Form.Control
                value={
                  addressTotalAmount.isEqualTo(0)
                    ? ""
                    : addressTotalAmount
                        .dividedBy(Math.pow(10, vestedToken.decimals))
                        .toFixed()
                }
                onChange={(e: any) => {
                  const newValue = new BigNumber(e.target.value);
                  setTotalAmount(
                    !newValue.isNaN()
                      ? new BigNumber(e.target.value).multipliedBy(
                          Math.pow(10, vestedToken.decimals)
                        )
                      : new BigNumber(0)
                  );
                }}
              />

              <OwnerButton
                className="mt-3"
                onClick={(e: any) => {
                  update_user_address(categoryName, {
                    address: addressWallet,
                    totalAmount: addressTotalAmount,
                    claimedAmount: new BigNumber(0),
                  });
                }}
              >
                {address.address != "" ? "Update address" : "Create address"}
              </OwnerButton>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button
            onClick={(e: any) => {
              setShowModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
