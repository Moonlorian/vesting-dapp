import {
  useGetNetworkConfig,
  useGetPendingTransactions,
} from "@multiversx/sdk-dapp/hooks";
import { queryContract } from "lib/queryContract";
import * as React from "react";
import { Key, useEffect, useState } from "react";
import {
  Accordion,
  Row,
  Col,
  AccordionContext,
  useAccordionButton,
  Card,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus, FaChevronRight, FaChevronDown } from "react-icons/fa";
import { Addresses } from "../Addresses/Addresses";
import { OwnerButton } from "components/AdminButton";
import styles from "../../dashboard.module.scss";
import { CategoryChangeModal } from "./CategoryChangeModal";
import { remove_category } from "lib/transactions";
import { Loader } from "@multiversx/sdk-dapp/UI";

export interface CategoryType {
  name: string;
  unlockEpoch: number;
  period: number;
  percent: number;
}

export const Categories = () => {
  const [firstDraw, setFirstDraw] = useState(true);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([
    {
      name: "",
      unlockEpoch: 0,
      period: 0,
      percent: 0,
    },
  ]);

  const { network } = useGetNetworkConfig();
  const { hasPendingTransactions } = useGetPendingTransactions();

  const loadCategoryData = async () => {
    const categoryData = await queryContract("get_categories", network);
    if (categoryData.firstValue) {
      const newCatetoryList: React.SetStateAction<CategoryType[]> = [];
      categoryData.firstValue?.valueOf().map((item: any, index: any) => {
        const newCategoryData = {
          name: "",
          unlockEpoch: 0,
          period: 0,
          percent: 0,
        };
        newCategoryData.name = item[0].toString();
        newCategoryData.unlockEpoch = item[1].unlock_epoch.toString(10);
        newCategoryData.period = item[1].period.toString(10);
        newCategoryData.percent = item[1].percent.toString(10);
        newCatetoryList.push(newCategoryData);
      });
      setFirstDraw(false);
      setCategoryList(newCatetoryList);
    }
  };

  useEffect(() => {
    loadCategoryData();
  }, [hasPendingTransactions]);

  return (
    <>
      <Row className="d-none d-md-flex font-22">
        <Col className="text-start" md={4}>
          Name
        </Col>
        <Col className="text-end" md={3}>
          {"Lock (cliff)"}
        </Col>
        <Col className="text-end" md={2}>
          Percent
        </Col>
        <Col className="text-end" md={3}>
          Epoch
          <CategoryChangeModal
            category={{
              name: "",
              unlockEpoch: 0,
              period: 0,
              percent: 0,
            }}
          />
        </Col>
      </Row>
      {firstDraw && (
        <Loader />
      )}
      <Accordion flush>
        {categoryList.map((category: CategoryType, index: Key) => (
          <Accordion.Item key={index} eventKey={index.toString()}>
            <CategoryInfo
              eventKey={index.toString()}
              category={category}
            ></CategoryInfo>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};

function CategoryInfo({ children, eventKey, category }: any) {
  const { activeEventKey } = React.useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey, () => {});
  return (
    <>
      <div className="px-2 category_row" onClick={decoratedOnClick}>
        <Row className="font-22">
          <Col className="text-start pt-2" xs={12} md={5}>
            <span className="d-md-none">Name: </span>
            {activeEventKey != eventKey && (
            <FaChevronRight />
            )}
            {activeEventKey == eventKey && (
            <FaChevronDown />
            )}
            {category.name}
          </Col>
          <Col className="text-end pt-2" xs={12} md={2}>
            {category.unlockEpoch}
            <span className="d-md-none"> Lock (cliff)</span>
          </Col>
          <Col className="text-end pt-2" xs={12} md={2}>
            {(category.percent / 100).toFixed(2)}%{" "}
            <span className="d-md-none"> Percent</span>
          </Col>
          <Col className="text-end" xs={12} md={3}>
            <div className="d-inline-block pt-2">
              {category.period} <span className="d-md-none">periods</span>
            </div>
            <CategoryChangeModal category={category} />
            <OwnerButton
              className={`text-center d-inline-block font-16 m-1 ${styles.categoryButtons}`}
              onClick={(e: any) => {
                e.stopPropagation();
                remove_category(category.name);
              }}
            >
              <FaTrashAlt />
            </OwnerButton>
          </Col>
        </Row>
      </div>
      <Accordion.Collapse eventKey={eventKey}>
        <Addresses
          category={category.name}
          loadWallets={activeEventKey === eventKey}
        />
      </Accordion.Collapse>
    </>
  );
}
