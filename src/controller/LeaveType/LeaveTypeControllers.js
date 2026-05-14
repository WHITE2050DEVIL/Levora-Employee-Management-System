//External Lib Import
const ObjectId = require("mongoose").Types.ObjectId;

//Internal Model and Service Imports
const LeaveTypeModel = require("../../model/LeaveType/LeaveTypeModel");
const { CreateError } = require("../../helper/ErrorHandler");

const CheckAssociateService = require("../../services/Common/CheckAssociateService");
const CreateService = require("../../services/Common/CreateService");
const DropDownService = require("../../services/Common/DropDownService");
const ListService = require("../../services/Common/ListService");
const UpdateService = require("../../services/Common/UpdateService");
const DeleteService = require("../../services/Common/DeleteService");
const DetailsService = require("../../services/Common/DetailsService");

/**
 * @desc LeaveType Create
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeCreate
 * @method POST
 */
const LeaveTypeCreate = async (req, res, next) => {
  try {
    // Check if a category with the same name already exists
    const associate = await CheckAssociateService(
      { LeaveTypeName: req.body.LeaveTypeName },
      LeaveTypeModel,
    );

    if (associate) {
      throw CreateError("This Leave Type Category has already been created.");
    }

    const result = await CreateService(req, LeaveTypeModel);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveType List
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeList/:pageNumber/:perPage/:searchKeyword
 * @method GET
 */
const LeaveTypeList = async (req, res, next) => {
  try {
    // 👇 FIXED: Added fallback baseline check to safeguard against undefined keywords
    const searchKeyword = req.params.searchKeyword || "";
    let SearchRgx = { $regex: searchKeyword, $options: "i" };
    let SearchArray = [{ LeaveTypeName: SearchRgx }];

    const result = await ListService(req, LeaveTypeModel, SearchArray);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveType Drop Down
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeDropDown
 * @method GET
 */
const LeaveTypeDropDown = async (req, res, next) => {
  try {
    const result = await DropDownService(
      req,
      LeaveTypeModel,
      { LeaveTypeStatus: true },
      { label: "$LeaveTypeName", value: "$_id" }, // Passes native Object IDs cleanly for relational Mongoose joins
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveType Details
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeDetails/:id
 * @method GET
 */
const LeaveTypeDetails = async (req, res, next) => {
  try {
    const result = await DetailsService(req, LeaveTypeModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveType Update
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeUpdate/:id
 * @method PATCH
 */
const LeaveTypeUpdate = async (req, res, next) => {
  try {
    const result = await UpdateService(req, LeaveTypeModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc LeaveType Delete
 * @access private
 * @route /api/v1/LeaveType/LeaveTypeDelete/:id
 * @method DELETE
 */
const LeaveTypeDelete = async (req, res, next) => {
  try {
    const result = await DeleteService(req, LeaveTypeModel);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  LeaveTypeCreate,
  LeaveTypeDropDown,
  LeaveTypeList,
  LeaveTypeDetails,
  LeaveTypeUpdate,
  LeaveTypeDelete,
};