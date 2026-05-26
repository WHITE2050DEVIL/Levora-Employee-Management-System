// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import { ResetTagDetails } from "../redux/slices/TagSlice";
import {
  SetTotalTag,
  SetTagLists,
  SetTagDetails,
  SetTagDropDown,
} from "../redux/slices/TagSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class TagRequest {
  // ==========================================
  // 1. CREATE TAG
  // ==========================================
  static async TagCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/Tag/TagCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetTagDetails());
        ToastMessage.successMessage("Tag Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("TagCreate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to create tag";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. GET PAGINATED TAG LIST
  // ==========================================
  static async TagList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/Tag/TagList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetTagDetails());
        store.dispatch(SetTagLists(listData));
        store.dispatch(SetTotalTag(totalCount));
      } else {
        store.dispatch(SetTagLists([]));
        store.dispatch(SetTotalTag(0));
      }
    } catch (error) {
      console.error("TagList Failed:", error);
      store.dispatch(SetTagLists([]));
      store.dispatch(SetTotalTag(0));
    }
  }

  // ==========================================
  // 3. GET TAG DROPDOWN OPTIONS
  // ==========================================
  static async TagDropDown() {
    try {
      const response = await RestClient.getRequest(`/Tag/TagDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetTagDropDown(cleanArray));
      }
    } catch (error) {
      console.error("TagDropDown Failed:", error);
      store.dispatch(SetTagDropDown([]));
    }
  }

  // ==========================================
  // 4. GET SINGLE TAG DETAILS
  // ==========================================
  static async TagDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request signature
      const response = await RestClient.getRequest(`/Tag/TagDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetTagDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("TagDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 5. UPDATE TAG
  // ==========================================
  static async TagUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/Tag/TagUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetTagDetails());
        ToastMessage.successMessage("Tag Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("TagUpdate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to update tag";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 6. DELETE TAG
  // ==========================================
  static async TagDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/Tag/TagDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Tag Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("TagDelete Failed:", error);
      return false;
    }
  }
}

export default TagRequest;