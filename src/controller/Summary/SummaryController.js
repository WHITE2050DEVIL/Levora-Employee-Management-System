//External Lib Import
const ObjectId = require("mongoose").Types.ObjectId;

//Internal Model and Service Imports
const LeaveModel = require("../../model/Leave/LeaveModel");
const { CreateError } = require("../../helper/ErrorHandler");
const DashboardSummaryEmployeeService = require("../../services/Summary/DashboardSummaryEmployeeService");
const DashboardSummaryHodService = require("../../services/Summary/DashboardSummaryHodService");
const DashboardSummaryAdminService = require("../../services/Summary/DashboardSummaryAdminService");

/**
 * @desc Dashboard Summary Employee
 * @access private
 * @route /api/v1/Summary/DashboardSummaryEmployee
 * @method GET
 */
const DashboardSummaryEmployee = async (req, res, next) => {
  try {
    // 👇 FIXED: Explicitly cast string ID to a native MongoDB ObjectId 
    // so that the internal aggregation pipeline matches records correctly.
    if (req.EmployeeId) {
      req.EmployeeId = new ObjectId(req.EmployeeId);
    }

    const result = await DashboardSummaryEmployeeService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Dashboard Summary Employee Hod
 * @access private
 * @route /api/v1/Summary/DashboardSummaryHod
 * @method GET
 */
const DashboardSummaryHod = async (req, res, next) => {
  try {
    // 👇 FIXED: Explicitly cast string ID to a native MongoDB ObjectId
    if (req.EmployeeId) {
      req.EmployeeId = new ObjectId(req.EmployeeId);
    }

    const result = await DashboardSummaryHodService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Dashboard Summary Admin
 * @access private
 * @route /api/v1/Summary/DashboardSummaryAdmin
 * @method GET
 */
const DashboardSummaryAdmin = async (req, res, next) => {
  try {
    // 👇 FIXED: Explicitly cast string ID to a native MongoDB ObjectId
    if (req.EmployeeId) {
      req.EmployeeId = new ObjectId(req.EmployeeId);
    }

    const result = await DashboardSummaryAdminService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  DashboardSummaryEmployee,
  DashboardSummaryHod,
  DashboardSummaryAdmin,
};