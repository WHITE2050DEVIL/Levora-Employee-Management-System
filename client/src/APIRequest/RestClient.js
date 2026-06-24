// External Import
import axios from "axios";

// Internal Import
import SessionHelper from "../helpers/SessionHelper";
import ToastMessage from "../helpers/ToastMessage";
import { SetLogout } from "../redux/slices/AuthSlice";
import { RemoveLoading, SetLoading } from "../redux/slices/LoaderSlice";
import { RemoveUserDetails } from "../redux/slices/UserSlice";
import store from "../redux/store/store";

/* ==========================================
   AXIOS CONFIGURATION
   ========================================== */
const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================================
   REQUEST INTERCEPTOR (Automated Token Injection)
   ========================================== */
API.interceptors.request.use(
  (config) => {
    // Globally trigger loading state before request fires
    store.dispatch(SetLoading());

    const token = SessionHelper.GetToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(RemoveLoading());
    return Promise.reject(error);
  }
);

/* ==========================================
   RESPONSE INTERCEPTOR (Global Error & Loader Handling)
   ========================================== */
API.interceptors.response.use(
  (response) => {
    // Turn off loader globally on successful response
    store.dispatch(RemoveLoading());
    return response;
  },
  (error) => {
    // Turn off loader globally on failed response
    store.dispatch(RemoveLoading());
    
    console.error("API Error Captured:", error);

    const status = error?.response?.status;
    const backendMessage = error?.response?.data?.message;

    if (status === 500) {
      ToastMessage.errorMessage(backendMessage || "Internal Server Error");
    } 
    else if (status === 401) {
      ToastMessage.errorMessage(backendMessage || "Session expired. Please log in again.");
      
      // Clear out the stale authentication states across Redux
      store.dispatch(SetLogout());
      store.dispatch(RemoveUserDetails());
    } 
    else if (status === 403) {
      ToastMessage.errorMessage("Access Denied: Insufficient Privileges");
    } 
    else if (status === 404) {
      ToastMessage.errorMessage(backendMessage || "Requested API Endpoint Not Found");
    } 
    else {
      ToastMessage.errorMessage(backendMessage || "Something went wrong. Please try again.");
    }

    // Returns false so your service requests catch structural failure cleanly
    return false; 
  }
);

/* ==========================================
   REST CLIENT IMPLEMENTATION
   ========================================== */
class RestClient {
  static async getRequest(url) {
    try {
      return await API.get(url);
    } catch (error) {
      return false;
    }
  }

  static async postRequest(url, postBody) {
    try {
      return await API.post(url, postBody);
    } catch (error) {
      return false;
    }
  }

  static async updateRequest(url, postBody) {
    try {
      return await API.patch(url, postBody);
    } catch (error) {
      return false;
    }
  }

  static async putRequest(url, postBody) {
    try {
      return await API.put(url, postBody);
    } catch (error) {
      return false;
    }
  }

  static async deleteRequest(url) {
    try {
      return await API.delete(url);
    } catch (error) {
      return false;
    }
  }
}

export default RestClient;
