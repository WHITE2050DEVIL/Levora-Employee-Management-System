//Internal import
const { CreateError } = require("../../helper/ErrorHandler");

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const VerifyRecoveryOtpService = async (Request, OtpModel, session) => {
  const OtpCode = String(
    Request.body?.OtpCode || Request.body?.OTP || Request.params?.OtpCode || "",
  ).trim();
  const Email = String(Request.body?.Email || Request.params?.Email || "")
    .trim()
    .toLowerCase();

  const countOtp = await OtpModel.aggregate([
    {
      $match: {
        $and: [{ Email: { $regex: `^${escapeRegExp(Email)}$`, $options: "i" } }, { OtpCode: OtpCode }],
      },
    },
  ]);

  if (!countOtp.length > 0) {
    throw CreateError("Invalid Otp Code", 400);
  }

  const useOtpCode = await OtpModel.aggregate([
    {
      $match: {
        $and: [
          { Email: { $regex: `^${escapeRegExp(Email)}$`, $options: "i" } },
          { OtpCode: OtpCode },
          { OtpStatus: 0 },
        ],
      },
    },
  ]);

  if (!useOtpCode.length > 0) {
    throw CreateError("Otp Code Allready Use", 400);
  }

  const otpCodeExpire = await OtpModel.aggregate([
    {
      $match: {
        OtpCodeExpire: { $gt: Date.now() },
      },
    },
  ]);

  if (!otpCodeExpire.length > 0) {
    throw CreateError("Expire Otp Code", 400);
  }

  await OtpModel.updateOne(
    { OtpCode: OtpCode },
    {
      OtpStatus: 1,
    },
    { new: true },
  );

  return { message: "Otp Verify Successful" };
};
module.exports = VerifyRecoveryOtpService;
