//External Lib Import
const bcrypt = require("bcrypt");

//Internal Import
const { CreateError } = require("../../helper/ErrorHandler");

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const RecoveryResetPassService = async (Request, EmployeesModel, OtpModel) => {
  const OtpCode = String(
    Request.body?.OtpCode || Request.body?.OTP || Request.params?.OtpCode || "",
  ).trim();
  const Email = String(Request.body?.Email || Request.params?.Email || "")
    .trim()
    .toLowerCase();
  let { Password } = Request.body;

  if (!Password) {
    throw CreateError("Invalid Data", 400);
  }

  const countOtp = await OtpModel.aggregate([
    {
      $match: {
        $and: [
          { Email: { $regex: `^${escapeRegExp(Email)}$`, $options: "i" } },
          { OtpCode: OtpCode },
          { OtpStatus: 1 },
        ],
      },
    },
  ]);

  if (!countOtp.length > 0) {
    throw CreateError("Invalid Otp Code", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(Password, salt);
  Password = hash;

  await EmployeesModel.updateOne(
    { Email: { $regex: `^${escapeRegExp(Email)}$`, $options: "i" } },
    {
      Password: Password,
    },
    { new: true },
  );

  return { message: "Password Reset Successfull" };
};
module.exports = RecoveryResetPassService;
