// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import {
  ResetEmployeeDetails,
  SetDepartmentHeadsList,
  SetStaffList,
  SetTotalEmployee,
  SetEmployeeLists,
  SetEmployeeDetails,
  SetEmployeeDropDown,
} from "../redux/slices/EmployeeSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class EmployeeRequest {
  // ==========================================
  // 1. CREATE EMPLOYEE
  // ==========================================
  static async EmployeeCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/Employee/EmployeeCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetEmployeeDetails());
        ToastMessage.successMessage("Employee Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("EmployeeCreate Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 2. GET PAGINATED EMPLOYEE LIST
  // ==========================================
  static async EmployeeList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/Employee/EmployeeList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetEmployeeDetails());
        store.dispatch(SetEmployeeLists(listData));
        store.dispatch(SetTotalEmployee(totalCount));
      } else {
        store.dispatch(SetEmployeeLists([]));
        store.dispatch(SetTotalEmployee(0));
      }
    } catch (error) {
      console.error("EmployeeList Failed:", error);
      store.dispatch(SetEmployeeLists([]));
      store.dispatch(SetTotalEmployee(0));
    }
  }

  // ==========================================
  // 3. GET DEPARTMENT HEADS
  // ==========================================
  static async DepartmentHeads() {
    try {
      // FIXED: Removed unused pagination parameters from signature since URL is un-paginated
      const response = await RestClient.getRequest(`/Employee/DepartmentHeads`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetDepartmentHeadsList(cleanArray));
      }
    } catch (error) {
      console.error("DepartmentHeads Failed:", error);
      store.dispatch(SetDepartmentHeadsList([]));
    }
  }

  // ==========================================
  // 4. GET STAFF LIST
  // ==========================================
  static async StaffList() {
    try {
      // FIXED: Removed unused pagination parameters from signature since URL is un-paginated
      const response = await RestClient.getRequest(`/Employee/StaffList`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetStaffList(cleanArray));
      }
    } catch (error) {
      console.error("StaffList Failed:", error);
      store.dispatch(SetStaffList([]));
    }
  }

  // ==========================================
  // 5. GET EMPLOYEE DROPDOWN
  // ==========================================
  static async EmployeeDropDown() {
    try {
      const response = await RestClient.getRequest(`/Employee/EmployeeDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetEmployeeDropDown(cleanArray));
      }
    } catch (error) {
      console.error("EmployeeDropDown Failed:", error);
      store.dispatch(SetEmployeeDropDown([]));
    }
  }

  // ==========================================
  // 6. GET SINGLE EMPLOYEE DETAILS
  // ==========================================
  static async EmployeeDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request signature
      const response = await RestClient.getRequest(`/Employee/EmployeeDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetEmployeeDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("EmployeeDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 7. UPDATE EMPLOYEE
  // ==========================================
  static async EmployeeUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/Employee/EmployeeUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetEmployeeDetails());
        ToastMessage.successMessage("Employee Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("EmployeeUpdate Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 8. DELETE EMPLOYEE
  // ==========================================
  static async EmployeeDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/Employee/EmployeeDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Employee Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("EmployeeDelete Failed:", error);
      return false;
    }
  }
}

export default EmployeeRequest;