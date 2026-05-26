// Internal Import
import { SetTotalSummary, SetSummaryLists } from "../redux/slices/SummarySlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class SummaryRequest {
  // ==========================================
  // 1. ADMIN DASHBOARD SUMMARY
  // ==========================================
  static async DashboardSummaryAdmin() {
    try {
      const response = await RestClient.getRequest(`/Summary/DashboardSummaryAdmin`);
      
      // Handling both nested and unnested Axios response shapes safely
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const summaryData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(SetSummaryLists(summaryData));
        store.dispatch(SetTotalSummary(totalCount));
      } else {
        // Fallback cleanup if backend returns empty or malformed structures
        store.dispatch(SetSummaryLists([]));
        store.dispatch(SetTotalSummary(0));
      }
    } catch (error) {
      console.error("DashboardSummaryAdmin Request Failed:", error);
      store.dispatch(SetSummaryLists([]));
      store.dispatch(SetTotalSummary(0));
    }
  }

  // ==========================================
  // 2. HOD DASHBOARD SUMMARY
  // ==========================================
  static async DashboardSummaryHod() {
    try {
      const response = await RestClient.getRequest(`/Summary/DashboardSummaryHod`);
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const summaryData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(SetSummaryLists(summaryData));
        store.dispatch(SetTotalSummary(totalCount));
      } else {
        store.dispatch(SetSummaryLists([]));
        store.dispatch(SetTotalSummary(0));
      }
    } catch (error) {
      console.error("DashboardSummaryHod Request Failed:", error);
      store.dispatch(SetSummaryLists([]));
      store.dispatch(SetTotalSummary(0));
    }
  }

  // ==========================================
  // 3. EMPLOYEE DASHBOARD SUMMARY
  // ==========================================
  static async DashboardSummaryEmployee() {
    try {
      const response = await RestClient.getRequest(`/Summary/DashboardSummaryEmployee`);
      const responseData = response?.data?.data || response?.data;

      if (responseData && responseData[0]) {
        const summaryData = responseData[0]?.Data || [];
        const totalCount = responseData[0]?.Total?.[0]?.count || 0;

        store.dispatch(SetSummaryLists(summaryData));
        store.dispatch(SetTotalSummary(totalCount));
      } else {
        store.dispatch(SetSummaryLists([]));
        store.dispatch(SetTotalSummary(0));
      }
    } catch (error) {
      console.error("DashboardSummaryEmployee Request Failed:", error);
      store.dispatch(SetSummaryLists([]));
      store.dispatch(SetTotalSummary(0));
    }
  }
}

export default SummaryRequest;