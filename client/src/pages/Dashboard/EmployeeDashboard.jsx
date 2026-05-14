// @flow
import React, { useEffect } from "react";
import { Row, Col, Spinner, Card } from "react-bootstrap"; // 👈 FIXED: Added Card here
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Internal Component Imports
import Statistics from "./Statistics";
import LeaveChart from "./LeaveChart";
import SummaryRequest from "../../APIRequest/SummaryRequest";

const EmployeeDashboard = () => {
  const { t } = useTranslation();

  useEffect(() => {
    SummaryRequest.DashboardSummaryEmployee();
  }, []);

  // Connect to the global Redux state slice
  const { SummaryLists, TotalSummary } = useSelector((state) => state.Summary);

  // LOADING GUARD: If the network call hasn't finished, show a clean loader
  if (!SummaryLists) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2 text-muted">{t("Loading Dashboard Records...")}</span>
      </div>
    );
  }

  return (
    <>
      {/* HEADER SECTION */}
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <div className="page-title-right"></div>
            <h4 className="page-title">{t("Employee Dashboard")}</h4>
          </div>
        </Col>
      </Row>

      {/* STATISTICS CARDS */}
      <Row className="mb-3">
        <Col xs={12}>
          <Statistics summaryLists={SummaryLists} totalSummary={TotalSummary} />
        </Col>
      </Row>

      {/* CHART DATA RENDERING MATRIX */}
      <Row>
        <Col xs={12}>
          <Card className="p-3">
            <LeaveChart summaryLists={SummaryLists} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeDashboard;