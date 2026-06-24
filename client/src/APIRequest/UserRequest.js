//Internal Import
import SessionHelper from "../helpers/SessionHelper";
import ToastMessage from "../helpers/ToastMessage";
import { SetUserDetails } from "../redux/slices/UserSlice";
import store from "../redux/store/store";
import RestClient from "./RestClient";

class UserRequest {
  static async ProfileDetails() {
    const { data } = await RestClient.getRequest("/Employee/ProfileDetails");
    if (data) {
      // FIXED: Added ?.data so the user profile details actually load into state!
      store.dispatch(SetUserDetails(data?.data?.[0] || data?.data));
      return true;
    }
  }

  static async SendRecoveryOtp(Email) {
    const { data } = await RestClient.postRequest(
      `/Employee/SendRecoveryOtp`,
      { Email },
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      SessionHelper.SetRecoverVerifyEmail(Email);
      return true;
    }
  }

  static async VerifyRecoveryOtp(Otp) {
    const Email = SessionHelper.GetRecoverVerifyEmail();
    const { data } = await RestClient.postRequest(
      `/Employee/VerifyRecoveryOtp`,
      { Email, OtpCode: Otp },
    );
    if (data) {
      SessionHelper.SetRecoverVerifyOTP(Otp);
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }

  static async RecoveryResetPass(PostBody) {
    const Email = SessionHelper.GetRecoverVerifyEmail();
    const Otp = SessionHelper.GetRecoverVerifyOTP();
    const { data } = await RestClient.postRequest(
      `/RecoveryResetPass`,
      { ...PostBody, Email, OtpCode: Otp },
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }

  static async VerifyAccountSentOtp() {
    const Email = SessionHelper.GetRecoverVerifyEmail();
    const { data } = await RestClient.getRequest(
      `/User/VerifyAccountSentOtp/${encodeURIComponent(Email)}`,
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }

  static async VerifyAccountVerifyOtp(Email, Otp) {
    const { data } = await RestClient.getRequest(
      `/User/VerifyAccountVerifyOtp/${encodeURIComponent(Email)}/${encodeURIComponent(Otp)}`,
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }

  static async ProfileUpdate(PostBody) {
    const { data } = await RestClient.updateRequest(
      `/Employee/ProfileUpdate`,
      PostBody,
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }

  static async EmployeeChangePassword(PostBody) {
    const { data } = await RestClient.putRequest(
      `/Employee/EmployeeChangePassword`,
      PostBody,
    );
    if (data) {
      ToastMessage.successMessage(data?.message);
      return true;
    }
  }
}

export default UserRequest;
