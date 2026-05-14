// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import {
  SetTotalLeave,
  SetLeaveLists,
  SetLeaveDetails,
  SetLeaveDropDown,
  ResetLeaveDetails,
} from "../redux/slices/LeaveSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class LeaveRequest {
  // ==========================================
  // 1. CREATE LEAVE APPLICATION
  // ==========================================
  static async LeaveCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/Leave/LeaveCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetLeaveDetails());
        ToastMessage.successMessage("Leave Application Submitted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveCreate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to submit leave request";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. GET EMPLOYEE LEAVE LIST (SELF)
  // ==========================================
  static async LeaveList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/Leave/LeaveList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetLeaveDetails());
        store.dispatch(SetLeaveLists(listData));
        store.dispatch(SetTotalLeave(totalCount));
      } else {
        store.dispatch(SetLeaveLists([]));
        store.dispatch(SetTotalLeave(0));
      }
    } catch (error) {
      console.error("LeaveList Failed:", error);
      store.dispatch(SetLeaveLists([]));
      store.dispatch(SetTotalLeave(0));
    }
  }

  // ==========================================
  // 3. GET GLOBAL ADMIN LEAVE LIST
  // ==========================================
  static async LeaveAdminList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/Leave/LeaveAdminList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetLeaveDetails());
        store.dispatch(SetLeaveLists(listData));
        store.dispatch(SetTotalLeave(totalCount));
      } else {
        store.dispatch(SetLeaveLists([]));
        store.dispatch(SetTotalLeave(0));
      }
    } catch (error) {
      console.error("LeaveAdminList Failed:", error);
      store.dispatch(SetLeaveLists([]));
      store.dispatch(SetTotalLeave(0));
    }
  }

  // ==========================================
  // 4. FILTER LEAVES BY STATUS (ADMIN VIEW)
  // ==========================================
  static async LeaveListAdminByStatus(pageNumber, perPage, searchKey, postBody) {
    try {
      const response = await RestClient.postRequest(
        `/Leave/LeaveListAdminByStatus/${pageNumber}/${perPage}/${searchKey}`,
        postBody
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetLeaveDetails());
        store.dispatch(SetLeaveLists(listData));
        store.dispatch(SetTotalLeave(totalCount));
      } else {
        store.dispatch(SetLeaveLists([]));
        store.dispatch(SetTotalLeave(0));
      }
    } catch (error) {
      console.error("LeaveListAdminByStatus Failed:", error);
      store.dispatch(SetLeaveLists([]));
      store.dispatch(SetTotalLeave(0));
    }
  }

  // ==========================================
  // 5. FILTER LEAVES BY STATUS (HOD VIEW)
  // ==========================================
  static async LeaveListHodByStatus(pageNumber, perPage, searchKey, postBody) {
    try {
      const response = await RestClient.postRequest(
        `/Leave/LeaveListHodByStatus/${pageNumber}/${perPage}/${searchKey}`,
        postBody
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetLeaveDetails());
        store.dispatch(SetLeaveLists(listData));
        store.dispatch(SetTotalLeave(totalCount));
      } else {
        store.dispatch(SetLeaveLists([]));
        store.dispatch(SetTotalLeave(0));
      }
    } catch (error) {
      console.error("LeaveListHodByStatus Failed:", error);
      store.dispatch(SetLeaveLists([]));
      store.dispatch(SetTotalLeave(0));
    }
  }

  // ==========================================
  // 6. GET LEAVE TYPE DROPDOWN OPTIONS
  // ==========================================
  static async LeaveDropDown() {
    try {
      const response = await RestClient.getRequest(`/Leave/LeaveDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetLeaveDropDown(cleanArray));
      }
    } catch (error) {
      console.error("LeaveDropDown Failed:", error);
      store.dispatch(SetLeaveDropDown([]));
    }
  }

  // ==========================================
  // 7. GET SINGLE LEAVE SLIP DETAILS
  // ==========================================
  static async LeaveDetails(id) {
    try {
      const response = await RestClient.getRequest(`/Leave/LeaveDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetLeaveDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 8. UPDATE LEAVE (EDIT / APPROVE / REJECT)
  // ==========================================
  static async LeaveUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/Leave/LeaveUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetLeaveDetails());
        ToastMessage.successMessage("Leave Record Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveUpdate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to update leave record";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 9. RECOVERY / REMOVE LEAVE RECORD
  // ==========================================
  static async LeaveDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/Leave/LeaveDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Leave Application Cancelled Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("LeaveDelete Failed:", error);
      return false;
    }
  }
}

export default LeaveRequest;