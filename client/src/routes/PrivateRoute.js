import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SessionHelper from "../helpers/SessionHelper";

const PrivateRoute = ({ component: Component }) => {
  const { AccessToken } = useSelector((state) => state.Auth);
  
  // Hard check: Look at Redux OR look directly at the storage helper
  const isAuth = AccessToken || SessionHelper.GetToken();

  // If we have an auth signal, show the Layout (Component), otherwise Login
  return isAuth ? <Component /> : <Navigate to="/account/login" />;
};

export default PrivateRoute;