// @flow
import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// API Requests
import EmployeeRequest from "../../APIRequest/EmployeeRequest";
import SummaryRequest from "../../APIRequest/SummaryRequest";

// Child Components
import Statistics from "./Statistics";
import DepartmentHead from "./DepartmentHead";
import StaffListCom from "./StaffList";

const AdminDashboard = () => {
  const { t } = useTranslation();

  // 1. Fetch data on dashboard mount
  useEffect(() => {
    // Wrapped in an IIFE or clean sequence to ensure token headers apply
    const fetchDashboardData = async () => {
      try {
        await EmployeeRequest.EmployeeList(1, 5, "0");
        await SummaryRequest.DashboardSummaryAdmin();
        await EmployeeRequest.DepartmentHeads();
        await EmployeeRequest.StaffList();
      } catch (error) {
        console.error("Dashboard data fetching failed:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // 2. Select data from Redux safely
  const { TotalEmployee, DepartmentHeadsList, StaffList } = useSelector(
    (state) => state.Employee || {}
  );

  const { SummaryLists, TotalSummary } = useSelector(
    (state) => state.Summary || {}
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <div className="page-title-box">
            <h4 className="page-title">{t("Dashboard")}</h4>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row>
        <Col>
          <Statistics
            totalEmployee={TotalEmployee || 0}
            totalLeave={TotalSummary || 0}
            summaryLists={SummaryLists || []}
          />
        </Col>
      </Row>

      {/* Management Tables */}
      <Row>
        <Col lg={6}>
          <DepartmentHead departmentHeadsList={DepartmentHeadsList || []} />
        </Col>
        <Col lg={6}>
          <StaffListCom staffList={StaffList || []} />
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;