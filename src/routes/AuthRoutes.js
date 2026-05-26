//External Lib Import
const AuthRoutes = require("express").Router();

//Internal Lib Import
const AuthControllers = require("../controller/Auth/AuthControllers");


// =========================
// REGISTER USER
// =========================

AuthRoutes.post(
  "/RegisterUser",
  AuthControllers.RegisterUser
);


// =========================
// LOGIN USER
// =========================

AuthRoutes.post(
  "/LoginUser",
  AuthControllers.LoginUser
);


module.exports = AuthRoutes;