const jwt = require("jsonwebtoken");

const CreateToken = (payLoad) => {

  const secret =
    process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "JWT_SECRET_KEY missing in .env"
    );
  }

  return jwt.sign(
    payLoad,
    secret,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = CreateToken;