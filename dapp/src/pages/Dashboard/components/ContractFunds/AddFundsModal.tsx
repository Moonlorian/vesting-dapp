import * as React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { OwnerButton } from "components/AdminButton";
import { add_funds, set_listing_epoch } from "lib/transactions";
import { BigNumber } from "@multiversx/sdk-core/node_modules/bignumber.js";
import { AllowedTokenContext } from "lib/DappContexts";
import { FaPlus } from "react-icons/fa";

export const AddFundsModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [funds, setFunds] = useState(new BigNumber(0));

  const vestedToken = React.useContext(AllowedTokenContext);

  return (
    <>
      <OwnerButton
        title="Add funds"
        onClick={(e: any) => setShowModal(true)}
      >
        <FaPlus />
      </OwnerButton>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title>Add funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                value={
                  funds.isEqualTo(0)
                    ? ""
                    : funds
                        .dividedBy(Math.pow(10, vestedToken.decimals))
                        .toFixed()
                }
                onChange={(e: any) => {
                  const newValue = new BigNumber(e.target.value);
                  setFunds(
                    !newValue.isNaN()
                      ? new BigNumber(e.target.value).multipliedBy(
                          Math.pow(10, vestedToken.decimals)
                        )
                      : new BigNumber(0)
                  );
                }}
              />
              <OwnerButton className="mt-3" onClick={(e:any) => {add_funds(vestedToken.id, funds)}}>
                Add funds
              </OwnerButton>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
