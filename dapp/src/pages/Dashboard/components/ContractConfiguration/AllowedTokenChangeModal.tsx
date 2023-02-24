import * as React from "react";
import { FaEdit } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { OwnerButton } from "components/AdminButton";
import { set_vested_token } from "lib/transactions";

export const AllowedTokenChangeModal = ({
  currentAllowedToken,
}: {
  currentAllowedToken: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newAllowedToken, setNewAllowedToken] = useState(currentAllowedToken);

  React.useEffect(() => {
    setNewAllowedToken(currentAllowedToken);
  }, [currentAllowedToken]);

  return (
    <>
      <OwnerButton
        title="Change allowed token"
        onClick={(e: any) => setShowModal(true)}
      >
        <FaEdit />
      </OwnerButton>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title>Change allowed token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Allowrd Tokens</Form.Label>
              <Form.Control value={newAllowedToken} onChange={((e:any) => {setNewAllowedToken(e.target.value)})}/>
              <OwnerButton className="mt-3" onClick={(e:any) => {set_vested_token(newAllowedToken)}}>
                Change allowed token
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
