// @flow
import React, { useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
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
      <section className="hr-dashboard-hero">
        <div>
          <span className="badge bg-light text-primary mb-3">
            {t("Admin Workspace")}
          </span>
          <h1>{t("Employee Management Command Center")}</h1>
          <p>
            {t(
              "Track people, departments, leave approvals, and daily HR activity from one focused workspace."
            )}
          </p>
          <div className="hr-hero-actions">
            <Link to="/employee/employee-create-update" className="btn btn-light">
              <i className="mdi mdi-account-plus-outline me-1"></i>
              {t("Add Employee")}
            </Link>
            <Link to="/leave/leave-list-pending" className="btn btn-outline-light">
              <i className="mdi mdi-calendar-clock me-1"></i>
              {t("Review Pending Leave")}
            </Link>
          </div>
        </div>
        <div className="hr-hero-stat-panel">
          <span>{t("People in system")}</span>
          <strong>{TotalEmployee || 0}</strong>
          <p className="mb-0">
            {t("Across staff, department heads, and administrators.")}
          </p>
        </div>
      </section>

      <Statistics
        totalEmployee={TotalEmployee || 0}
        totalLeave={TotalSummary || 0}
        summaryLists={SummaryLists || []}
      />

      <Card className="mb-4">
        <Card.Body>
          <div className="hr-list-header">
            <div>
              <h4>{t("Quick Actions")}</h4>
              <p>{t("Jump into the most-used HR workflows.")}</p>
            </div>
          </div>
          <div className="hr-quick-actions">
            <Link to="/employee/employee-list" className="hr-quick-action-card">
              <i className="mdi mdi-account-search-outline"></i>
              <span>
                <strong>{t("Staff Directory")}</strong>
                <span>{t("Search and manage employees")}</span>
              </span>
            </Link>
            <Link to="/department/department-list" className="hr-quick-action-card">
              <i className="mdi mdi-domain"></i>
              <span>
                <strong>{t("Departments")}</strong>
                <span>{t("Organize teams and heads")}</span>
              </span>
            </Link>
            <Link to="/leave/leave-list" className="hr-quick-action-card">
              <i className="mdi mdi-file-document-check-outline"></i>
              <span>
                <strong>{t("Leave Desk")}</strong>
                <span>{t("Approve, reject, and audit")}</span>
              </span>
            </Link>
          </div>
        </Card.Body>
      </Card>

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
