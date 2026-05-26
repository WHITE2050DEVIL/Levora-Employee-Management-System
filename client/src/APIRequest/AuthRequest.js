// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import { SetLogin } from "../redux/slices/AuthSlice";
import { SetUserDetails } from "../redux/slices/UserSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class AuthRequest {
  // ==========================================
  // 1. USER REGISTRATION
  // ==========================================
  static async RegisterUser(postBody) {
    try {
      const response = await RestClient.postRequest("/Auth/RegisterUser", postBody);
      
      // Safe extraction wrapper to navigate nested vs flat response structures
      const responseData = response?.data?.data || response?.data;
      const message = response?.data?.message || "Registration Successful";

      if (responseData) {
        ToastMessage.successMessage(message);
        return true;
      }
      return false;
    } catch (error) {
      console.error("RegisterUser Failed:", error);
      // Grabbing error message directly from backend response if available
      const errMsg = error?.response?.data?.message || "Registration Failed";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. USER LOGIN (JWT & RBAC CAPTURE)
  // ==========================================
  static async LoginUser(postBody) {
    try {
      const response = await RestClient.postRequest("/Auth/LoginUser", postBody);
      
      // Normalizes variations in payload nesting shapes
      const responseData = response?.data?.data || response?.data;

      // Extract details from whichever nesting layer holds them
      const token = responseData?.AccessToken || response?.data?.AccessToken;
      const userDetails = responseData?.UserDetails || response?.data?.UserDetails;

      if (token && userDetails) {
        // Core synchronization step: writes data to Redux and LocalStorage simultaneously
        store.dispatch(SetLogin(token));
        store.dispatch(SetUserDetails(userDetails));
        
        ToastMessage.successMessage("User Login Successful");
        return true; 
      } else {
        console.error("AuthRequest Error: AccessToken or UserDetails missing in payload", response?.data);
        ToastMessage.errorMessage("Invalid credentials or incomplete user payload.");
        return false;
      }
    } catch (error) {
      console.error("LoginUser Failed:", error);
      const errMsg = error?.response?.data?.message || "Login Failed. Please check network.";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }
}

export default AuthRequest;