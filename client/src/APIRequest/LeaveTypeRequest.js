// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import {
  SetTotalLeaveType,
  SetLeaveTypeLists,
  SetLeaveTypeDetails,
  SetLeaveTypeDropDown,
  ResetLeaveTypeDetails,
} from "../redux/slices/LeaveTypeSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class LeaveTypeRequest {
  // ==========================================
  // 1. CREATE LEAVE TYPE
  // ==========================================
  static async LeaveTypeCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/LeaveType/LeaveTypeCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetLeaveTypeDetails());
        ToastMessage.successMessage("Leave Type Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveTypeCreate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to create leave type";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. GET PAGINATED LEAVE TYPE LIST
  // ==========================================
  static async LeaveTypeList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/LeaveType/LeaveTypeList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetLeaveTypeDetails());
        store.dispatch(SetLeaveTypeLists(listData));
        store.dispatch(SetTotalLeaveType(totalCount));
      } else {
        store.dispatch(SetLeaveTypeLists([]));
        store.dispatch(SetTotalLeaveType(0));
      }
    } catch (error) {
      console.error("LeaveTypeList Failed:", error);
      store.dispatch(SetLeaveTypeLists([]));
      store.dispatch(SetTotalLeaveType(0));
    }
  }

  // ==========================================
  // 3. GET LEAVE TYPE DROPDOWN OPTIONS
  // ==========================================
  static async LeaveTypeDropDown() {
    try {
      const response = await RestClient.getRequest(`/LeaveType/LeaveTypeDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetLeaveTypeDropDown(cleanArray));
      }
    } catch (error) {
      console.error("LeaveTypeDropDown Failed:", error);
      store.dispatch(SetLeaveTypeDropDown([]));
    }
  }

  // ==========================================
  // 4. GET SINGLE LEAVE TYPE DETAILS
  // ==========================================
  static async LeaveTypeDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request signature
      const response = await RestClient.getRequest(`/LeaveType/LeaveTypeDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetLeaveTypeDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveTypeDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 5. UPDATE LEAVE TYPE
  // ==========================================
  static async LeaveTypeUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/LeaveType/LeaveTypeUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetLeaveTypeDetails());
        ToastMessage.successMessage("Leave Type Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveTypeUpdate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to update leave type";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 6. DELETE LEAVE TYPE
  // ==========================================
  static async LeaveTypeDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/LeaveType/LeaveTypeDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Leave Type Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveTypeDelete Failed:", error);
      return false;
    }
  }
}

export default LeaveTypeRequest;