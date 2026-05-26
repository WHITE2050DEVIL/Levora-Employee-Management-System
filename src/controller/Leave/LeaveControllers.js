//External Lib Import
const ObjectId = require("mongoose").Types.ObjectId;

//Internal Model and Service Imports
const LeaveModel = require("../../model/Leave/LeaveModel");
const { CreateError } = require("../../helper/ErrorHandler");

const CheckAssociateService = require("../../services/Common/CheckAssociateService");
const CreateService = require("../../services/Common/CreateService");
const DropDownService = require("../../services/Common/DropDownService");
const LeaveListService = require("../../services/Common/LeaveListService");
const UpdateService = require("../../services/Common/UpdateService");
const DeleteService = require("../../services/Common/DeleteService");
const DetailsService = require("../../services/Common/DetailsService");
const DashboardSummaryEmployeeService = require("../../services/Summary/DashboardSummaryEmployeeService");
const FilterLeaveByStatusHodService = require("../../services/Common/FilterLeaveByStatusHodService");
const FilterLeaveByStatusAdminService = require("../../services/Common/FilterLeaveByStatusAdminService");

/**
 * @desc Leave Create
 * @access private
 * @route /api/v1/Leave/LeaveCreate
 * @method POST
 */
const LeaveCreate = async (req, res, next) => {
  try {
    const authenticatedUserId = req.EmployeeId;

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Active user session tracker ID missing from token request middleware context."
      });
    }

    req.body.EmployeeId = authenticatedUserId;

    const result = await CreateService(req, LeaveModel);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveList
 * @access private
 * @route /api/v1/Leave/LeaveList
 * @method GET
 */
const LeaveList = async (req, res, next) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    let SearchRgx = { $regex: searchKeyword, $options: "i" };
    
    // 👇 FIXED: Removed LeaveType regex search to prevent ObjectId query mismatches
    let SearchArray = [{ LeaveDetails: SearchRgx }];
    let MatchQuery = {};

    // If a regular employee logs in, restrict the lookup query scope to their personal ID context
    if (req.Roles?.toUpperCase() !== "ADMIN" && req.Roles?.toUpperCase() !== "HOD") {
      MatchQuery.EmployeeId = new ObjectId(req.EmployeeId);
    }

    const JoinStageOne = {
      $lookup: {
        from: "employees",
        localField: "EmployeeId",
        foreignField: "_id",
        as: "Employee",
      },
    };

    const JoinStageTwo = {
      $lookup: {
        from: "leavetypes",
        localField: "LeaveType",
        foreignField: "_id",
        as: "LeaveType",
      },
    };

    const projection = {
      $project: {
        LeaveType: {
          $first: "$LeaveType.LeaveTypeName",
        },
        LeaveDetails: 1,
        NumOfDay: 1,
        HodStatus: 1,
        AdminStatus: 1,
        createdAt: 1,
        Employee: {
          FirstName: 1,
          LastName: 1,
          Email: 1,
          Image: 1,
        },
      },
    };

    const result = await LeaveListService(
      req,
      LeaveModel,
      SearchArray,
      MatchQuery,
      JoinStageOne,
      JoinStageTwo,
      projection,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveAdminList
 * @access private
 * @route /api/v1/Leave/LeaveAdminList
 * @method GET
 */
const LeaveAdminList = async (req, res, next) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    let SearchRgx = { $regex: searchKeyword, $options: "i" };
    let SearchArray = [{ LeaveDetails: SearchRgx }];
    
    // 👇 FIXED: Unified base query criteria for general admin views
    let MatchQuery = { HodStatus: "Approved" };

    if (req.Roles?.toUpperCase() !== "ADMIN") {
      MatchQuery.EmployeeId = new ObjectId(req.EmployeeId);
    }

    const JoinStageOne = {
      $lookup: {
        from: "employees",
        localField: "EmployeeId",
        foreignField: "_id",
        as: "Employee",
      },
    };

    const JoinStageTwo = {
      $lookup: {
        from: "leavetypes",
        localField: "LeaveType",
        foreignField: "_id",
        as: "LeaveType",
      },
    };

    const projection = {
      $project: {
        LeaveType: {
          $first: "$LeaveType.LeaveTypeName",
        },
        LeaveDetails: 1,
        NumOfDay: 1,
        HodStatus: 1,
        AdminStatus: 1,
        createdAt: 1,
        Employee: {
          FirstName: 1,
          LastName: 1,
          Email: 1,
          Image: 1,
      },
    },
  };

    const result = await LeaveListService(
      req,
      LeaveModel,
      SearchArray,
      MatchQuery,
      JoinStageOne,
      JoinStageTwo,
      projection,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveListAdminByStatus
 * @access private
 * @route /api/v1/Leave/LeaveListAdmin/status
 * @method POST
 */
const LeaveListAdminByStatus = async (req, res, next) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    let SearchRgx = { $regex: searchKeyword, $options: "i" };
    
    // 👇 FIXED: Removed 'LeaveType: SearchRgx' string lookup restriction
    let SearchArray = [{ LeaveDetails: SearchRgx }];
    
    // 👇 FIXED: Ensures Admin queries find rows that have passed HOD sign-off
    let MatchQuery = { 
      AdminStatus: req.body.status,
      HodStatus: "Approved"
    };

    const JoinStageOne = {
      $lookup: {
        from: "employees",
        localField: "EmployeeId",
        foreignField: "_id",
        as: "Employee",
      },
    };

    const JoinStageTwo = {
      $lookup: {
        from: "leavetypes",
        localField: "LeaveType",
        foreignField: "_id",
        as: "LeaveType",
      },
    };

    const projection = {
      $project: {
        LeaveType: {
          $first: "$LeaveType.LeaveTypeName",
        },
        LeaveDetails: 1,
        NumOfDay: 1,
        HodStatus: 1,
        AdminStatus: 1,
        createdAt: 1,
        Employee: {
          FirstName: 1,
          LastName: 1,
          Email: 1,
          Image: 1,
        },
      },
    };

    const result = await LeaveListService(
      req,
      LeaveModel,
      SearchArray,
      MatchQuery,
      JoinStageOne,
      JoinStageTwo,
      projection,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveListHodByStatus
 * @access private
 * @route /api/v1/Leave/LeaveListHodByStatus/status
 * @method POST
 */
const LeaveListHodByStatus = async (req, res, next) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    let SearchRgx = { $regex: searchKeyword, $options: "i" };
    
    // 👇 FIXED: Standardized search parameters map criteria
    let SearchArray = [{ LeaveDetails: SearchRgx }];
    let MatchQuery = { HodStatus: req.body.status };

    const JoinStageOne = {
      $lookup: {
        from: "employees",
        localField: "EmployeeId",
        foreignField: "_id",
        as: "Employee",
      },
    };

    const JoinStageTwo = {
      $lookup: {
        from: "leavetypes",
        localField: "LeaveType",
        foreignField: "_id",
        as: "LeaveType",
      },
    };

    const projection = {
      $project: {
        LeaveType: {
          $first: "$LeaveType.LeaveTypeName",
        },
        LeaveDetails: 1,
        NumOfDay: 1,
        HodStatus: 1,
        AdminStatus: 1,
        createdAt: 1,
        Employee: {
          FirstName: 1,
          LastName: 1,
          Email: 1,
          Image: 1,
        },
      },
    };

    const result = await LeaveListService(
      req,
      LeaveModel,
      SearchArray,
      MatchQuery,
      JoinStageOne,
      JoinStageTwo,
      projection,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Leave Drop Down
 * @access private
 * @route /api/v1/Leave/LeaveDropDown
 * @method GET
 */
const LeaveDropDown = async (req, res, next) => {
  try {
    const result = await DropDownService(
      req,
      LeaveModel,
      { LeaveStatus: true },
      { label: "$LeaveName", value: "$LeaveSlug" },
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Leave Details
 * @access private
 * @route /api/v1/Leave/LeaveDetails/:id
 * @method GET
 */
const LeaveDetails = async (req, res, next) => {
  try {
    const result = await DetailsService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Leave Update
 * @access private
 * @route /api/v1/Leave/LeaveUpdate/:id
 * @method PATCH
 */
const LeaveUpdate = async (req, res, next) => {
  try {
    const result = await UpdateService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Leave Delete
 * @access private
 * @route /api/v1/Leave/LeaveDelete/:id
 * @method DELETE
 */
const LeaveDelete = async (req, res, next) => {
  try {
    const result = await DeleteService(req, LeaveModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  LeaveCreate,
  LeaveList,
  LeaveAdminList,
  LeaveListAdminByStatus,
  LeaveListHodByStatus,
  LeaveDropDown,
  LeaveDetails,
  LeaveUpdate,
  LeaveDelete,
};