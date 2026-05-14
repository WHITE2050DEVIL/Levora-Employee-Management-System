// =========================
// INTERNAL IMPORTS
// =========================

const EmployeeModel = require("../../model/Employee/EmployeeModel");

const RegistrationService = require(
  "../../services/Auth/RegistrationService"
);

const LoginService = require(
  "../../services/Auth/LoginService"
);



// =========================
// REGISTER USER
// =========================

const RegisterUser = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await RegistrationService(
        req,
        EmployeeModel
      );



    return res.status(201).json({

      success: true,

      message:
        "Registration Successful",

      data: result,
    });

  } catch (error) {

    next(error);
  }
};



// =========================
// LOGIN USER
// =========================

const LoginUser = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await LoginService(
        req,
        EmployeeModel
      );



    return res.status(200).json({

      success: true,

      message:
        "Login Successful",

      AccessToken:
        result.AccessToken,

      UserDetails:
        result.UserDetails,
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    next(error);
  }
};



// =========================
// EXPORTS
// =========================

module.exports = {

  RegisterUser,

  LoginUser,
};