// ===============================================
// EMPLOYEE CONTROLLERS WITH STRUCTURAL TRANSLATION
// ===============================================

// ===============================================
// INTERNAL IMPORTS
// ===============================================
const EmployeeModel = require("../../model/Employee/EmployeeModel");
const OtpModel = require("../../model/Otps/OtpModel");

const EmployeeCreateService = require("../../services/Employee/EmployeeCreateService");
const EmployeeDetailsService = require("../../services/Employee/EmployeeDetailsService");
const EmployeeUpdateService = require("../../services/Employee/EmployeeUpdateService");
const EmployeePasswordChangeService = require("../../services/Employee/EmployeePasswordChangeService");
const VerifyRecoveryOtpService = require("../../services/Employee/VerifyRecoveryOtpService");
const SendRecoveryOtpService = require("../../services/Employee/SendRecoveryOtpService");
const RecoveryResetPassService = require("../../services/Employee/RecoveryResetPassService");
const EmployeeListService = require("../../services/Employee/EmployeeListService");

const DetailsService = require("../../services/Common/DetailsService");
const UpdateService = require("../../services/Common/UpdateService");
const DeleteService = require("../../services/Common/DeleteService");

// ===============================================
// DATA MUTATION DATA TRANSFORMATION UTILITIES
// ===============================================

/**
 * Combines frontend FirstName and LastName into a single Name string for Mongoose validation
 */
const processIncomingPayload = (body) => {
  if (body && (body.FirstName || body.LastName)) {
    body.Name = `${body.FirstName || ""} ${body.LastName || ""}`.trim();
  }
  return body;
};

/**
 * Splits database Name field into FirstName and LastName properties expected by your frontend UI tables
 */
const transformEmployeeData = (data) => {
  if (!data) return data;

  // Handle standard array results
  if (Array.isArray(data)) {
    return data.map((item) => transformEmployeeData(item));
  }

  // Convert Mongoose document to a mutable JavaScript object
  let obj = typeof data.toObject === "function" ? data.toObject() : { ...data };

  // Traverse nested pagination properties if returned by generic listing services
  if (obj.Rows && Array.isArray(obj.Rows)) {
    obj.Rows = obj.Rows.map((item) => transformEmployeeData(item));
    return obj;
  }
  if (obj.data && Array.isArray(obj.data)) {
    obj.data = obj.data.map((item) => transformEmployeeData(item));
    return obj;
  }

  // Parse strings out to populate front-end expectations
  if (obj.Name && (!obj.FirstName || !obj.LastName)) {
    const parts = obj.Name.trim().split(/\s+/);
    obj.FirstName = parts[0] || "";
    obj.LastName = parts.slice(1).join(" ") || "";
  }

  return obj;
};

// ===============================================
// EMPLOYEE CREATE
// ===============================================
const EmployeeCreate = async (req, res, next) => {
  try {
    req.body = processIncomingPayload(req.body);

    const result = await EmployeeCreateService(req, EmployeeModel);

    res.status(201).json({
      success: true,
      message: "Employee Created Successfully",
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// EMPLOYEE LIST
// ===============================================
const EmployeeList = async (req, res, next) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    const SearchRgx = { $regex: searchKeyword, $options: "i" };

    const SearchArray = [
      { Name: SearchRgx },
      { Phone: SearchRgx },
      { Email: SearchRgx },
      { Roles: SearchRgx },
    ];

    const result = await EmployeeListService(req, EmployeeModel, SearchArray);

    res.status(200).json({
      success: true,
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// EMPLOYEE DETAILS
// ===============================================
const EmployeeDetails = async (req, res, next) => {
  try {
    const result = await DetailsService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// EMPLOYEE UPDATE
// ===============================================
const EmployeeUpdate = async (req, res, next) => {
  try {
    req.body = processIncomingPayload(req.body);

    const result = await UpdateService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      message: "Employee Updated Successfully",
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// PROFILE DETAILS
// ===============================================
const ProfileDetails = async (req, res, next) => {
  try {
    const result = await EmployeeDetailsService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// PROFILE UPDATE
// ===============================================
const ProfileUpdate = async (req, res, next) => {
  try {
    req.body = processIncomingPayload(req.body);

    const result = await EmployeeUpdateService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// CHANGE PASSWORD
// ===============================================
const EmployeeChangePassword = async (req, res, next) => {
  try {
    const result = await EmployeePasswordChangeService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// EMPLOYEE DELETE
// ===============================================
const EmployeeDelete = async (req, res, next) => {
  try {
    const result = await DeleteService(req, EmployeeModel);

    res.status(200).json({
      success: true,
      message: "Employee Deleted Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// SEND RECOVERY OTP
// ===============================================
const SendRecoveryOtp = async (req, res, next) => {
  try {
    const result = await SendRecoveryOtpService(req, EmployeeModel, OtpModel);

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// VERIFY RECOVERY OTP
// ===============================================
const VerifyRecoveryOtp = async (req, res, next) => {
  try {
    const result = await VerifyRecoveryOtpService(req, OtpModel);

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// RESET PASSWORD
// ===============================================
const RecoveryResetPass = async (req, res, next) => {
  try {
    const result = await RecoveryResetPassService(req, EmployeeModel, OtpModel);

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// DEPARTMENT HEADS
// ===============================================
const DepartmentHeads = async (req, res, next) => {
  try {
    const result = await EmployeeModel.find({ Roles: "HOD" }).select("-Password");

    res.status(200).json({
      success: true,
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// STAFF LIST
// ===============================================
const StaffList = async (req, res, next) => {
  try {
    const result = await EmployeeModel.find({ Roles: "STAFF" }).select("-Password");

    res.status(200).json({
      success: true,
      data: transformEmployeeData(result),
    });
  } catch (error) {
    next(error);
  }
};

// ===============================================
// EXPORTS
// ===============================================
module.exports = {
  EmployeeCreate,
  EmployeeList,
  EmployeeDetails,
  ProfileDetails,
  ProfileUpdate,
  EmployeeChangePassword,
  EmployeeUpdate,
  EmployeeDelete,
  SendRecoveryOtp,
  VerifyRecoveryOtp,
  RecoveryResetPass,
  DepartmentHeads,
  StaffList,
};
