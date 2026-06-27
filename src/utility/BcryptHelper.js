// =========================
// External Library Import
// =========================

const bcrypt = require("bcryptjs");

// =========================
// Hash Password
// =========================

const HashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required");
  }

  return await bcrypt.hash(password, 10);
};

// =========================
// Verify Password
// =========================

const VerifyPassword = async (password, hashPassword) => {
  if (!password || !hashPassword) {
    return false;
  }

  return await bcrypt.compare(password, hashPassword);
};

// =========================
// Export
// =========================

module.exports = {
  HashPassword,
  VerifyPassword,
};