//Create Custom Error
const CreateError = (msg, status = 400) => {
  const e = new Error(msg);
  e.status = status;
  return e;
};

//Not Found Error Handler
const NotFoundError = (req, res, next) => {
  const error = CreateError(
    `Your Requested Content was not found on this Server`,
    404,
  );
  next(error);
};

// Default Error Handler
const DefaultErrorHandler = (err, req, res, next) => {
  let message = err.message || "Server Error Occurred";
  let status = err.status || 500;

  // 1. Catch Mongoose Validation Errors (e.g., Invalid Email)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(", ");
    status = 400;
  }

  // 2. Catch Mongoose Duplicate Key Errors (e.g., Email already exists)
  if (err.code === 11000) {
    message = `Duplicate field value entered`;
    status = 400;
  }

  // Log the exact error to your backend terminal so you can read it!
  console.log("=== SERVER CRASH DETAILS ===");
  console.log(err);
  console.log("============================");

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : [],
  });
};

module.exports = { DefaultErrorHandler, CreateError, NotFoundError };
