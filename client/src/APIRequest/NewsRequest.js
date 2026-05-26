// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import {
  SetTotalNews,
  SetNewsLists,
  SetNewsDetails,
  SetNewsDropDown,
  ResetNewsDetails,
} from "../redux/slices/NewsSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class NewsRequest {
  // ==========================================
  // 1. CREATE ANNOUNCEMENT / NEWS
  // ==========================================
  static async NewsCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/News/NewsCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetNewsDetails());
        ToastMessage.successMessage("Announcement Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("NewsCreate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to create announcement";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. GET PAGINATED ANNOUNCEMENTS LIST
  // ==========================================
  static async NewsList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/News/NewsList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetNewsDetails());
        store.dispatch(SetNewsLists(listData));
        store.dispatch(SetTotalNews(totalCount));
      } else {
        store.dispatch(SetNewsLists([]));
        store.dispatch(SetTotalNews(0));
      }
    } catch (error) {
      console.error("NewsList Failed:", error);
      store.dispatch(SetNewsLists([]));
      store.dispatch(SetTotalNews(0));
    }
  }

  // ==========================================
  // 3. GET ANNOUNCEMENTS DROPDOWN OPTIONS
  // ==========================================
  static async NewsDropDown() {
    try {
      const response = await RestClient.getRequest(`/News/NewsDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetNewsDropDown(cleanArray));
      }
    } catch (error) {
      console.error("NewsDropDown Failed:", error);
      store.dispatch(SetNewsDropDown([]));
    }
  }

  // ==========================================
  // 4. GET SINGLE ANNOUNCEMENT DETAILS
  // ==========================================
  static async NewsDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request signature
      const response = await RestClient.getRequest(`/News/NewsDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetNewsDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("NewsDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 5. UPDATE ANNOUNCEMENT / NEWS
  // ==========================================
  static async NewsUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/News/NewsUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetNewsDetails());
        ToastMessage.successMessage("Announcement Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("NewsUpdate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to update announcement";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 6. DELETE ANNOUNCEMENT / NEWS
  // ==========================================
  static async NewsDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/News/NewsDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("Announcement Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("NewsDelete Failed:", error);
      return false;
    }
  }
}

export default NewsRequest;