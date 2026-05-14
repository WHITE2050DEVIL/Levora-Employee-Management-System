// ===============================
// DEPARTMENT CONTROLLER
// ===============================



// ===============================
// INTERNAL IMPORTS
// ===============================

const DepartmentModel = require(
  "../../model/Department/DepartmentModel"
);

const {
  CreateError,
} = require("../../helper/ErrorHandler");

const CheckAssociateService = require(
  "../../services/Common/CheckAssociateService"
);

const CreateService = require(
  "../../services/Common/CreateService"
);

const DropDownService = require(
  "../../services/Common/DropDownService"
);

const ListService = require(
  "../../services/Common/ListService"
);

const UpdateService = require(
  "../../services/Common/UpdateService"
);

const DeleteService = require(
  "../../services/Common/DeleteService"
);

const DetailsService = require(
  "../../services/Common/DetailsService"
);



// ===============================
// DEPARTMENT CREATE
// ===============================

const DepartmentCreate = async (
  req,
  res,
  next
) => {

  try {

    // CHECK EXISTING DEPARTMENT
    const associate =
      await CheckAssociateService(

        {
          DepartmentName:
            req.body.DepartmentName,
        },

        DepartmentModel
      );



    if (associate) {

      throw CreateError(
        "Department Already Exists",
        400
      );
    }



    // CREATE DEPARTMENT
    const result =
      await CreateService(
        req,
        DepartmentModel
      );



    res.status(201).json({

      success: true,

      message:
        "Department Created Successfully",

      data: result,
    });

  } catch (error) {

    next(error);
  }
};



// ===============================
// DEPARTMENT LIST
// ===============================

const DepartmentList = async (
  req,
  res,
  next
) => {

  try {

    const searchKeyword =
      req.params.searchKeyword || "";



    const SearchRgx = {

      $regex: searchKeyword,

      $options: "i",
    };



    const SearchArray = [

      {
        DepartmentName:
          SearchRgx,
      },

      {
        DepartmentShortName:
          SearchRgx,
      },

      {
        DepartmentDetails:
          SearchRgx,
      },
    ];



    const result =
      await ListService(
        req,
        DepartmentModel,
        SearchArray
      );



    res.status(200).json({

      success: true,

      data: result,
    });

  } catch (error) {

    next(error);
  }
};



// ===============================
// DEPARTMENT DROPDOWN
// ===============================

const DepartmentDropDown =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await DropDownService(

          req,

          DepartmentModel,

          {
            DepartmentStatus: true,
          },

          {
            label:
              "$DepartmentName",

            value: "$_id",
          }
        );



      res.status(200).json({

        success: true,

        data: result,
      });

    } catch (error) {

      next(error);
    }
  };



// ===============================
// DEPARTMENT DETAILS
// ===============================

const DepartmentDetails =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await DetailsService(
          req,
          DepartmentModel
        );



      res.status(200).json({

        success: true,

        data: result,
      });

    } catch (error) {

      next(error);
    }
  };



// ===============================
// DEPARTMENT UPDATE
// ===============================

const DepartmentUpdate =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await UpdateService(
          req,
          DepartmentModel
        );



      res.status(200).json({

        success: true,

        message:
          "Department Updated Successfully",

        data: result,
      });

    } catch (error) {

      next(error);
    }
  };



// ===============================
// DEPARTMENT DELETE
// ===============================

const DepartmentDelete =
  async (
    req,
    res,
    next
  ) => {

    try {

      const result =
        await DeleteService(
          req,
          DepartmentModel
        );



      res.status(200).json({

        success: true,

        message:
          "Department Deleted Successfully",

        data: result,
      });

    } catch (error) {

      next(error);
    }
  };



// ===============================
// EXPORTS
// ===============================

module.exports = {

  DepartmentCreate,

  DepartmentDropDown,

  DepartmentList,

  DepartmentDetails,

  DepartmentUpdate,

  DepartmentDelete,
};