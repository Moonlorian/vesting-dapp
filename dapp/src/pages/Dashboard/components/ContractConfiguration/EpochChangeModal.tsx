import * as React from "react";
import { FaEdit } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { OwnerButton } from "components/AdminButton";
import { set_listing_epoch } from "lib/transactions";

export const EpochChangeModal = ({
  currentListingEpoch,
}: {
  currentListingEpoch: number;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newListingEpoch, setNewListingEpoch] = useState(currentListingEpoch);

  React.useEffect(() => {
    setNewListingEpoch(currentListingEpoch);
  }, [currentListingEpoch]);

  return (
    <>
      <OwnerButton
        title="Change initial epoch"
        onClick={(e: any) => setShowModal(true)}
      >
        <FaEdit />
      </OwnerButton>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title>Change listing epoch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New listing epoch</Form.Label>
              <Form.Control value={newListingEpoch} onChange={((e:any) => {setNewListingEpoch(e.target.value)})}/>
              <OwnerButton className="mt-3" onClick={(e:any) => {set_listing_epoch(newListingEpoch)}}>
                Change listing epoch
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
