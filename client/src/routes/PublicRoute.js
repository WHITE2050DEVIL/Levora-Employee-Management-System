// External Lib Import
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Internal Lib Import
import SessionHelper from "../helpers/SessionHelper";

const PublicRoute = ({ component: RouteComponent }) => {
  const { AccessToken } = useSelector((state) => state.Auth);

  // Check Redux OR check localStorage directly
  const isAuth = AccessToken || SessionHelper.GetToken();

  // If NOT authenticated, show the public page (Login/Register)
  // If authenticated, redirect them away from login to the dashboard
  return !isAuth ? <RouteComponent /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;