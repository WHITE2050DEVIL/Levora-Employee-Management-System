//Internal Lib Import
const { CreateError } = require("../../helper/ErrorHandler");
const GenRandNumber = require("../../helper/GenRandNumber");
const SendMailUtility = require("../../utility/SendMailUtility");

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SendRecoveryOtpService = async (Request, EmployeesModel, OtpModel) => {
  const Email = String(Request.body?.Email || Request.params?.Email || "")
    .trim()
    .toLowerCase();

  const Employee = await EmployeesModel.aggregate([
    { $match: { Email: { $regex: `^${escapeRegExp(Email)}$`, $options: "i" } } },
  ]);
  if (!Employee.length > 0) {
    throw CreateError("Employee Not Found", 404);
  }

  const OtpCode = GenRandNumber(6);

  const EmailBody = `<p>${Employee[0].Name},
  Your ${process.env.APPLICATION_NAME} Account Recovery Code is <b>${OtpCode}</b> </p>`;

  const EmailSubject = `Your ${process.env.APPLICATION_NAME} Account Recovery Code`;

  await SendMailUtility(Email, EmailBody, EmailSubject);

  const newOtpCode = new OtpModel({
    OtpCode: OtpCode,
    Email: Email,
  });

  await newOtpCode.save();

  return { message: "Otp Send Successfull" };
};
module.exports = SendRecoveryOtpService;
