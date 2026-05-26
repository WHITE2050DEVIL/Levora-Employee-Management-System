// @flow
import classNames from "classnames";
import React from "react";
import { Row, Col } from "react-bootstrap";

const Statistics = ({ totalEmployee, totalLeave, summaryLists }) => {
  const getSummaryCount = (status) =>
    summaryLists?.find((summary) => summary?._id === status)?.count || 0;

  const cards = [
    {
      label: "Total Employees",
      value: totalEmployee || 0,
      icon: "mdi mdi-account-group-outline",
      tone: "primary",
    },
    {
      label: "Total Leave",
      value: totalLeave || 0,
      icon: "dripicons-clipboard",
      tone: "success",
    },
    {
      label: "Pending Leave",
      value: getSummaryCount("Pending"),
      icon: "dripicons-hourglass",
      tone: "warning",
    },
    {
      label: "Rejected Leave",
      value: getSummaryCount("Rejected"),
      icon: "dripicons-document-delete",
      tone: "danger",
    },
    {
      label: "Approved Leave",
      value: getSummaryCount("Approved"),
      icon: "dripicons-thumbs-up",
      tone: "success",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((card) => (
        <Col sm={6} xl key={card.label}>
          <div className="hr-stat-card">
            <span className={classNames("hr-stat-icon", card.tone)}>
              <i className={classNames(card.icon, "font-22")}></i>
            </span>
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Statistics;
