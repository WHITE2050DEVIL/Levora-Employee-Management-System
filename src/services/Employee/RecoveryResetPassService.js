// =========================
// External Library Import
// =========================

const bcrypt = require("bcryptjs");

// =========================
// Internal Imports
// =========================

const { CreateError } = require("../../helper/ErrorHandler");

// =========================
// Helper Function
// =========================

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// =========================
// Recovery Reset Password Service
// =========================

const RecoveryResetPassService = async (
  Request,
  EmployeesModel,
  OtpModel
) => {
  // Get OTP
  const OtpCode = String(
    Request.body?.OtpCode ||
      Request.body?.OTP ||
      Request.params?.OtpCode ||
      ""
  ).trim();

  // Get Email
  const Email = String(
    Request.body?.Email ||
      Request.params?.Email ||
      ""
  )
    .trim()
    .toLowerCase();

  // Get Password
  let { Password } = Request.body;

  // =========================
  // Validation
  // =========================

  if (!Password) {
    throw CreateError("Invalid Data", 400);
  }

  // =========================
  // Verify OTP
  // =========================

  const countOtp = await OtpModel.aggregate([
    {
      $match: {
        $and: [
          {
            Email: {
              $regex: `^${escapeRegExp(Email)}$`,
              $options: "i",
            },
          },
          {
            OtpCode: OtpCode,
          },
          {
            OtpStatus: 1,
          },
        ],
      },
    },
  ]);

  if (countOtp.length === 0) {
    throw CreateError("Invalid OTP Code", 400);
  }

  // =========================
  // Hash Password
  // =========================

  const hashedPassword = await bcrypt.hash(Password, 10);

  // =========================
  // Update Password
  // =========================

  await EmployeesModel.updateOne(
    {
      Email: {
        $regex: `^${escapeRegExp(Email)}$`,
        $options: "i",
      },
    },
    {
      Password: hashedPassword,
    },
    {
      new: true,
    }
  );

  // =========================
  // Success Response
  // =========================

  return {
    message: "Password Reset Successfully",
  };
};

module.exports = RecoveryResetPassService;