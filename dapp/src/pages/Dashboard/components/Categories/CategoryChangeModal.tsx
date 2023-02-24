import * as React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { OwnerButton } from "components/AdminButton";
import { update_category } from "lib/transactions";
import { CategoryType } from "./Categories";
import styles from "../../dashboard.module.scss";

export const CategoryChangeModal = ({
  category,
}: {
  category: CategoryType;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [categoryLock, setCategoryLock] = useState(category.unlockEpoch);
  const [categoryPercent, setCategoryPercent] = useState(
    category.percent / 100
  );
  const [categoryPeriods, setCategoryPeriods] = useState(category.period);

  React.useEffect(() => {
    setCategoryName(category.name);
    setCategoryLock(category.unlockEpoch);
    setCategoryPercent(category.percent / 100);
    setCategoryPeriods(category.period);
  }, [category]);

  return (
    <>
      <OwnerButton
        className={`text-center d-inline-block font-16 ml-3 m-1 ${styles.categoryButtons}`}
        title="Change Category"
        onClick={(e: any) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        {category.name !== "" ? <FaEdit /> : <FaPlus />}
      </OwnerButton>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        onClick={(e: any) => e.stopPropagation()}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title>{(category.name != '') ? "Update " : "Create new"} category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category name</Form.Label>
              <Form.Control
                value={categoryName}
                onChange={(e: any) => {
                  setCategoryName(e.target.value);
                }}
                disabled={category.name !== ""}
              />
              <Form.Label className="mt-3">Lock (cliff)</Form.Label>
              <Form.Control
                value={categoryLock}
                onChange={(e: any) => {
                  setCategoryLock(e.target.value);
                }}
              />
              <Form.Label className="mt-3">
                Unlock percent per period
              </Form.Label>
              <Form.Control
                value={categoryPercent}
                onChange={(e: any) => {
                  setCategoryPercent(e.target.value);
                }}
              />
              <Form.Label className="mt-3">Epochs between periods</Form.Label>
              <Form.Control
                value={categoryPeriods}
                onChange={(e: any) => {
                  setCategoryPeriods(e.target.value);
                }}
              />
              <OwnerButton
                className="mt-3"
                onClick={(e: any) => {
                  update_category({
                    name: categoryName,
                    unlockEpoch: categoryLock,
                    period: categoryPeriods,
                    percent: categoryPercent * 100,
                  });
                }}
              >
                {(category.name != '') ? "Update category" : "Create category"}
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
