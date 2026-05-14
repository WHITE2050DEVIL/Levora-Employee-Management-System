// External Lib Import
import React, { useEffect, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

// Layout configurations
import DefaultLayout from "../layouts/Default";
import VerticalLayout from "../layouts/Vertical"; 

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Lazy Load Pages
const Login = React.lazy(() => import("../pages/Account/Login"));

// Role-Based Dashboards
const AdminDashboard = React.lazy(() => import("../pages/Dashboard/AdminDashboard"));
const HodDashboard = React.lazy(() => import("../pages/Dashboard/HodDashboard"));
const EmployeeDashboard = React.lazy(() => import("../pages/Dashboard/EmployeeDashboard"));

// ==========================================
// DYNAMIC FEATURE VIEW IMPORTS (FIXED IMPORTS)
// ==========================================
const DepartmentListPage = React.lazy(() => import("../pages/Department/DepartmentListPage"));
const DepartmentCreateUpdatePage = React.lazy(() => import("../pages/Department/DepartmentCreateUpdatePage"));

const EmployeeListPage = React.lazy(() => import("../pages/Employee/EmployeeListPage"));
const EmployeeCreateUpdatePage = React.lazy(() => import("../pages/Employee/EmployeeCreateUpdatePage"));

const LeaveTypeListPage = React.lazy(() => import("../pages/LeaveType/LeaveTypeListPage"));
const LeaveTypeCreateUpdatePage = React.lazy(() => import("../pages/LeaveType/LeaveTypeCreateUpdatePage")); // 👈 FIXED: Added missing import

// Leave Management Views
const LeaveListPage = React.lazy(() => import("../pages/Leave/LeaveAdminListPage"));
const LeaveAdminUpdatePage = React.lazy(() => import("../pages/Leave/LeaveAdminUpdatePage"));
const LeaveCreateUpdatePage = React.lazy(() => import("../pages/Leave/LeaveCreateUpdatePage"));

// Profile Core
const ProfilePage = React.lazy(() => import("../pages/Profile/ProfilePage"));
const ChangePasswordPage = React.lazy(() => import("../pages/Profile/ChangePasswordPage"));

// Suspense Fallback Loader wrapper
const LoadComponent = ({ component: Component }) => {
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);
  
  return (
    <Suspense fallback={
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    }>
      <Component />
    </Suspense>
  );
};

const AllRoutes = () => {
  const { UserDetails } = useSelector((state) => state.User);
  const { AccessToken } = useSelector((state) => state.Auth);

  // Safely grab user details whether wrapped in an array or object
  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const userRole = currentUser?.Roles?.toUpperCase();

  // Sync Guard: Halts execution to pull session state cleanly
  if (AccessToken && !currentUser) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Synchronizing Authorized Session...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ==========================================
          PUBLIC ROUTES
          ========================================== */}
      <Route path="/" element={<PublicRoute component={DefaultLayout} />}>
        <Route index element={<Navigate to="/account/login" />} />
        <Route path="account/login" element={<LoadComponent component={Login} />} />
      </Route>

      {/* ==========================================
          PROTECTED RBAC ROUTES
          ========================================== */}
      <Route path="/" element={<PrivateRoute component={VerticalLayout} />}>
        
        {/* ROLE DASHBOARD MATRIX */}
        <Route path="dashboard" element={
            userRole === "ADMIN" ? <LoadComponent component={AdminDashboard} /> :
            userRole === "HOD" ? <LoadComponent component={HodDashboard} /> :
            <LoadComponent component={EmployeeDashboard} />
        } />

        {/* DEPARTMENT PATHS */}
        <Route path="department/department-list" element={<LoadComponent component={DepartmentListPage} />} />
        <Route path="department/department-create-update" element={<LoadComponent component={DepartmentCreateUpdatePage} />} /> {/* 👈 FIXED COMPONENT */}

        {/* LEAVE TYPE PATHS */}
        <Route path="leave-type/leave-type-list" element={<LoadComponent component={LeaveTypeListPage} />} />
        <Route path="leave-type/leave-type-create-update" element={<LoadComponent component={LeaveTypeCreateUpdatePage} />} /> {/* 👈 FIXED: Added route */}

        {/* EMPLOYEE PATHS */}
        <Route path="employee/employee-list" element={<LoadComponent component={EmployeeListPage} />} />
        <Route path="employee/employee-create-update" element={<LoadComponent component={EmployeeCreateUpdatePage} />} /> {/* 👈 FIXED COMPONENT */}

        {/* LEAVE MANAGEMENT PATHS */}
        <Route path="leave/leave-list" element={<LoadComponent component={LeaveListPage} />} /> {/* 👈 FIXED syntax bracket */}
        
        <Route path="leave/leave-create-update" element={
            userRole === "ADMIN" ? <LoadComponent component={LeaveAdminUpdatePage} /> : <LoadComponent component={LeaveCreateUpdatePage} />
        } />

        <Route path="leave/leave-list-pending" element={<LoadComponent component={LeaveListPage} />} />
        <Route path="leave/leave-list-approved" element={<LoadComponent component={LeaveListPage} />} />
        <Route path="leave/leave-list-rejected" element={<LoadComponent component={LeaveListPage} />} />

        {/* SHARED PROFILES */}
        <Route path="account/profile" element={<LoadComponent component={ProfilePage} />} />
        <Route path="account/setting" element={<LoadComponent component={ChangePasswordPage} />} />

        {/* WILD-CARD ESCAPE CATCH */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;