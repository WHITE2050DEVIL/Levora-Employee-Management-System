// =========================
// INTERNAL LIB IMPORT
// =========================

const CreateToken = require("../../utility/CreateToken");

const { CreateError } = require("../../helper/ErrorHandler");

const {
  VerifyPassword,
} = require("../../utility/BcryptHelper");



// =========================
// LOGIN SERVICE
// =========================

const LoginService = async (
  Request,
  DataModel
) => {

  try {

    const {
      Email,
      Password,
    } = Request.body;



    // =========================
    // VALIDATION
    // =========================

    if (!Email || !Password) {

      throw CreateError(
        "Email and Password Required",
        400
      );
    }



    // =========================
    // FIND USER (SAFE)
    // =========================

    const User =
      await DataModel.findOne({
        Email: Email.trim(),
      });



    // =========================
    // USER NOT FOUND
    // =========================

    if (!User) {

      throw CreateError(
        "User Not Found",
        404
      );
    }



    // =========================
    // VERIFY PASSWORD
    // =========================

    const isMatch =
      await VerifyPassword(
        Password,
        User.Password
      );



    if (!isMatch) {

      throw CreateError(
        "Invalid Credentials",
        401
      );
    }



    // =========================
    // TOKEN PAYLOAD
    // =========================

    const payload = {

      id: User._id,

      Email: User.Email,

      Roles: User.Roles,
    };



    // =========================
    // CREATE TOKEN
    // =========================

    const AccessToken =
      await CreateToken(payload);



    // =========================
    // CLEAN USER OBJECT
    // =========================

    const UserDetails =
      User.toObject();

    delete UserDetails.Password;



    // =========================
    // RETURN RESPONSE
    // =========================

    return {

      AccessToken,

      UserDetails,
    };

  } catch (error) {

    throw error;
  }
};



module.exports = LoginService;