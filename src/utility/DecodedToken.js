// External Lib Import
const jwt = require("jsonwebtoken");

const DecodedToken = async (Token) => {

  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "JWT_SECRET_KEY is missing in .env file"
    );
  }

  if (!Token) {
    throw new Error("Token is required");
  }

  try {
    return jwt.verify(Token, secret);
  } catch (error) {
    throw new Error("Invalid or Expired Token");
  }
};

module.exports = DecodedToken;