// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import {
  SetTotalDepartment,
  SetDepartmentLists,
  SetDepartmentDetails,
  SetDepartmentDropDown,
  ResetDepartmentDetails,
} from "../redux/slices/DepartmentSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class DepartmentRequest {
  // ==========================================
  // 1. CREATE DEPARTMENT
  // ==========================================
  static async DepartmentCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/Department/DepartmentCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetDepartmentDetails());
        ToastMessage.successMessage("Department Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("DepartmentCreate Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 2. GET DEPARTMENT LIST (PAGINATED)
  // ==========================================
  static async DepartmentList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/Department/DepartmentList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetDepartmentDetails());
        store.dispatch(SetDepartmentLists(listData));
        store.dispatch(SetTotalDepartment(totalCount));
      } else {
        store.dispatch(SetDepartmentLists([]));
        store.dispatch(SetTotalDepartment(0));
      }
    } catch (error) {
      console.error("DepartmentList Failed:", error);
      store.dispatch(SetDepartmentLists([]));
      store.dispatch(SetTotalDepartment(0));
    }
  }

  // ==========================================
  // 3. GET DROPDOWN DATA
  // ==========================================
  static async DepartmentDropDown() {
    try {
      const response = await RestClient.getRequest(`/Department/DepartmentDropDown`);
      // Fallback matrix to safely extract array data
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        // Ensuring we pass a clean array format down to Redux
        const dropDownArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetDepartmentDropDown(dropDownArray));
      }
    } catch (error) {
      console.error("DepartmentDropDown Failed:", error);
      store.dispatch(SetDepartmentDropDown([]));
    }
  }

  // ==========================================
  // 4. GET SINGLE DEPARTMENT DETAILS
  // ==========================================
  static async DepartmentDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request
      const response = await RestClient.getRequest(`/Department/DepartmentDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        // Handle both standard objects and MongoDB aggregation single arrays
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetDepartmentDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("DepartmentDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 5. UPDATE DEPARTMENT
  // ==========================================
  static async DepartmentUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/Department/DepartmentUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetDepartmentDetails());
        ToastMessage.successMessage("Department Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("DepartmentUpdate Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 6. DELETE DEPARTMENT
  // ==========================================
  static async DepartmentDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/Department/DepartmentDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Department Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("DepartmentDelete Failed:", error);
      return false;
    }
  }
}

export default DepartmentRequest;