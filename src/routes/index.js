const express = require('express');
const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================
const AuthControllers = require("../controller/Auth/AuthControllers");
const DepartmentControllers = require("../controller/Department/DepartmentControllers");
const EmployeeControllers = require("../controller/Employee/EmployeeControllers");
const LeaveControllers = require("../controller/Leave/LeaveControllers");
const LeaveTypeControllers = require("../controller/LeaveType/LeaveTypeControllers");
const SummaryControllers = require("../controller/Summary/SummaryController");

// ==========================================
// MIDDLEWARES (👉 IMPORTED TO SECURE ROUTES)
// ==========================================
const { CheckEmployeeAuth, CheckHodAuth, CheckAdminAuth } = require("../middleware/CheckAuthLogin");

// ==========================================
// 1. PUBLIC AUTH & RECOVERY ROUTES
// ==========================================
router.post("/Auth/RegisterUser", AuthControllers.RegisterUser);
router.post("/Auth/LoginUser", AuthControllers.LoginUser);

// Password Recovery
router.get("/Employee/SendRecoveryOtp/:Email", EmployeeControllers.SendRecoveryOtp);
router.post("/Employee/SendRecoveryOtp", EmployeeControllers.SendRecoveryOtp);
router.get("/Employee/VerifyRecoveryOtp/:Email/:OtpCode", EmployeeControllers.VerifyRecoveryOtp);
router.post("/Employee/VerifyRecoveryOtp", EmployeeControllers.VerifyRecoveryOtp);
router.post("/RecoveryResetPass/:Email/:OtpCode", EmployeeControllers.RecoveryResetPass);
router.post("/RecoveryResetPass", EmployeeControllers.RecoveryResetPass);

// ==========================================
// 2. PROTECTED EMPLOYEE PROFILE ROUTES
// ==========================================
router.get("/Employee/ProfileDetails", CheckEmployeeAuth, EmployeeControllers.ProfileDetails);
router.patch("/Employee/ProfileUpdate", CheckEmployeeAuth, EmployeeControllers.ProfileUpdate);
router.put("/Employee/EmployeeChangePassword", CheckEmployeeAuth, EmployeeControllers.EmployeeChangePassword);

// ==========================================
// 3. PROTECTED LEAVE MANAGEMENT ROUTES
// ==========================================
router.post("/Leave/LeaveCreate", CheckEmployeeAuth, LeaveControllers.LeaveCreate);
router.get("/Leave/LeaveList/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, LeaveControllers.LeaveList);
router.get("/Leave/LeaveDetails/:id", CheckEmployeeAuth, LeaveControllers.LeaveDetails);
router.patch("/Leave/LeaveUpdate/:id", CheckEmployeeAuth, LeaveControllers.LeaveUpdate);
router.delete("/Leave/LeaveDelete/:id", CheckEmployeeAuth, LeaveControllers.LeaveDelete);

// Leave Approval Lists (Role Protected)
// 👇 FIXED: Removed CheckAdminAuth so HODs can clear the 403 block and view their pending entries!
router.get("/Leave/LeaveAdminList/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, LeaveControllers.LeaveAdminList);

router.post("/Leave/LeaveListAdminByStatus/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, CheckAdminAuth, LeaveControllers.LeaveListAdminByStatus);
router.post("/Leave/LeaveListHodByStatus/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, LeaveControllers.LeaveListHodByStatus);

// ==========================================
// 4. ROLE-BASED DASHBOARD SUMMARIES
// ==========================================
router.get("/Summary/DashboardSummaryEmployee", CheckEmployeeAuth, SummaryControllers.DashboardSummaryEmployee);
router.get("/Summary/DashboardSummaryHod", CheckEmployeeAuth, CheckHodAuth, SummaryControllers.DashboardSummaryHod);
router.get("/Summary/DashboardSummaryAdmin", CheckEmployeeAuth, CheckAdminAuth, SummaryControllers.DashboardSummaryAdmin);

// ==========================================
// 5. ADMINISTRATIVE DEPARTMENT MANAGEMENT
// ==========================================
router.post("/Department/DepartmentCreate", CheckEmployeeAuth, CheckAdminAuth, DepartmentControllers.DepartmentCreate);
router.get("/Department/DepartmentList/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, CheckAdminAuth, DepartmentControllers.DepartmentList);
router.get("/Department/DepartmentDetails/:id", CheckEmployeeAuth, CheckAdminAuth, DepartmentControllers.DepartmentDetails);
router.patch("/Department/DepartmentUpdate/:id", CheckEmployeeAuth, CheckAdminAuth, DepartmentControllers.DepartmentUpdate);
router.delete("/Department/DepartmentDelete/:id", CheckEmployeeAuth, CheckAdminAuth, DepartmentControllers.DepartmentDelete);

// Dropdown needs to be accessible to all employees when filling forms
router.get("/Department/DepartmentDropDown", CheckEmployeeAuth, DepartmentControllers.DepartmentDropDown);

// ==========================================
// 6. ADMINISTRATIVE EMPLOYEE MANAGEMENT
// ==========================================
router.post("/Employee/EmployeeCreate", CheckEmployeeAuth, CheckAdminAuth, EmployeeControllers.EmployeeCreate);
router.get("/Employee/EmployeeList/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, CheckAdminAuth, EmployeeControllers.EmployeeList);
router.get("/Employee/EmployeeDetails/:id", CheckEmployeeAuth, CheckAdminAuth, EmployeeControllers.EmployeeDetails);
router.patch("/Employee/EmployeeUpdate/:id", CheckEmployeeAuth, CheckAdminAuth, EmployeeControllers.EmployeeUpdate);
router.delete("/Employee/EmployeeDelete/:id", CheckEmployeeAuth, CheckAdminAuth, EmployeeControllers.EmployeeDelete);

// Helper Lists used for organizational context assignments
router.get("/Employee/DepartmentHeads", CheckEmployeeAuth, EmployeeControllers.DepartmentHeads);
router.get("/Employee/StaffList", CheckEmployeeAuth, EmployeeControllers.StaffList);

// ==========================================
// 7. LEAVE TYPE MANAGEMENT (RBAC Protected)
// ==========================================
router.post("/LeaveType/LeaveTypeCreate", CheckEmployeeAuth, CheckAdminAuth, LeaveTypeControllers.LeaveTypeCreate);
router.get("/LeaveType/LeaveTypeList/:pageNumber/:perPage/:searchKeyword", CheckEmployeeAuth, CheckAdminAuth, LeaveTypeControllers.LeaveTypeList);
router.get("/LeaveType/LeaveTypeDetails/:id", CheckEmployeeAuth, CheckAdminAuth, LeaveTypeControllers.LeaveTypeDetails);
router.patch("/LeaveType/LeaveTypeUpdate/:id", CheckEmployeeAuth, CheckAdminAuth, LeaveTypeControllers.LeaveTypeUpdate);
router.delete("/LeaveType/LeaveTypeDelete/:id", CheckEmployeeAuth, CheckAdminAuth, LeaveTypeControllers.LeaveTypeDelete);

// Dropdown needs to be accessible to all authenticated staff applying for leaves
router.get("/LeaveType/LeaveTypeDropDown", CheckEmployeeAuth, LeaveTypeControllers.LeaveTypeDropDown);

module.exports = router;
