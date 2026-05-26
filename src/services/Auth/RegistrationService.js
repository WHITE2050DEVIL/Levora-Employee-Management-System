// INTERNAL LIB IMPORT

const { CreateError } = require("../../helper/ErrorHandler");

const {
  HashPassword,
} = require("../../utility/BcryptHelper");



const RegistrationService = async (
  Request,
  EmployeesModel
) => {

  try {

    const {
      Name,
      Phone,
      Email,
      Password,
      Roles,
    } = Request.body;



    // =========================
    // VALIDATION
    // =========================

    if (
      !Name ||
      !Phone ||
      !Email ||
      !Password
    ) {

      throw CreateError(
        "All Fields Required",
        400
      );
    }



    // =========================
    // CHECK EXISTING USER
    // =========================

    const existingEmployee =
      await EmployeesModel.findOne({

        $or: [
          { Email: Email },
          { Phone: Phone },
        ],
      });



    if (existingEmployee) {

      throw CreateError(
        "Employee Already Registered",
        400
      );
    }



    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await HashPassword(Password);



    // =========================
    // CREATE USER
    // =========================

    const newEmployee =
      new EmployeesModel({

        Name: Name,

        Phone: Phone,

        Email: Email,

        Password: hashedPassword,

        Roles: Roles || "STAFF",
      });



    // =========================
    // SAVE USER
    // =========================

    const Employee =
      await newEmployee.save();



    // =========================
    // REMOVE PASSWORD
    // =========================

    const EmployeeData =
      Employee.toObject();

    delete EmployeeData.Password;



    // =========================
    // RETURN RESPONSE
    // =========================

    return EmployeeData;

  } catch (error) {

    throw error;
  }
};



module.exports = RegistrationService;