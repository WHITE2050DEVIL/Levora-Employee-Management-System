const bcrypt = require("bcrypt");

const HashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const VerifyPassword = async (password, hashPassword) => {
  if (!password || !hashPassword) {
    return false;
  }

  return await bcrypt.compare(password, hashPassword);
};

module.exports = {
  HashPassword,
  VerifyPassword,
};