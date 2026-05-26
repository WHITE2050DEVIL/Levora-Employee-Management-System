// Internal Import
import ToastMessage from "../helpers/ToastMessage";
import { ResetSubCategoryDetails } from "../redux/slices/SubCategorySlice";
import {
  SetTotalSubCategory,
  SetSubCategoryLists,
  SetSubCategoryDetails,
  SetSubCategoryDropDown,
} from "../redux/slices/SubCategorySlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class SubCategoryRequest {
  // ==========================================
  // 1. CREATE SUB-CATEGORY
  // ==========================================
  static async SubCategoryCreate(postBody) {
    try {
      const response = await RestClient.postRequest("/SubCategory/SubCategoryCreate", postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetSubCategoryDetails());
        ToastMessage.successMessage("SubCategory Created Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("SubCategoryCreate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to create sub-category";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 2. GET PAGINATED SUB-CATEGORY LIST
  // ==========================================
  static async SubCategoryList(pageNumber, perPage, searchKey) {
    try {
      const response = await RestClient.getRequest(
        `/SubCategory/SubCategoryList/${pageNumber}/${perPage}/${searchKey}`
      );
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const listData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(ResetSubCategoryDetails());
        store.dispatch(SetSubCategoryLists(listData));
        store.dispatch(SetTotalSubCategory(totalCount));
      } else {
        store.dispatch(SetSubCategoryLists([]));
        store.dispatch(SetTotalSubCategory(0));
      }
    } catch (error) {
      console.error("SubCategoryList Failed:", error);
      store.dispatch(SetSubCategoryLists([]));
      store.dispatch(SetTotalSubCategory(0));
    }
  }

  // ==========================================
  // 3. GET SUB-CATEGORY DROPDOWN OPTIONS
  // ==========================================
  static async SubCategoryDropDown() {
    try {
      const response = await RestClient.getRequest(`/SubCategory/SubCategoryDropDown`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const cleanArray = Array.isArray(responseData) ? responseData : responseData?.Data || [];
        store.dispatch(SetSubCategoryDropDown(cleanArray));
      }
    } catch (error) {
      console.error("SubCategoryDropDown Failed:", error);
      store.dispatch(SetSubCategoryDropDown([]));
    }
  }

  // ==========================================
  // 4. GET SINGLE SUB-CATEGORY DETAILS
  // ==========================================
  static async SubCategoryDetails(id) {
    try {
      // FIXED: Removed unused postBody parameter from GET request signature
      const response = await RestClient.getRequest(`/SubCategory/SubCategoryDetails/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        const details = Array.isArray(responseData) ? responseData[0] : responseData;
        store.dispatch(SetSubCategoryDetails(details || null));
        return true;
      }
      return false;
    } catch (error) {
      console.error("SubCategoryDetails Failed:", error);
      return false;
    }
  }

  // ==========================================
  // 5. UPDATE SUB-CATEGORY
  // ==========================================
  static async SubCategoryUpdate(id, postBody) {
    try {
      const response = await RestClient.updateRequest(`/SubCategory/SubCategoryUpdate/${id}`, postBody);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        store.dispatch(ResetSubCategoryDetails());
        ToastMessage.successMessage("SubCategory Updated Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("SubCategoryUpdate Failed:", error);
      const errMsg = error?.response?.data?.message || "Failed to update sub-category";
      ToastMessage.errorMessage(errMsg);
      return false;
    }
  }

  // ==========================================
  // 6. DELETE SUB-CATEGORY
  // ==========================================
  static async SubCategoryDelete(id) {
    try {
      const response = await RestClient.deleteRequest(`/SubCategory/SubCategoryDelete/${id}`);
      const responseData = response?.data?.data || response?.data;

      if (responseData) {
        ToastMessage.successMessage("SubCategory Deleted Successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("SubCategoryDelete Failed:", error);
      return false;
    }
  }
}

export default SubCategoryRequest;