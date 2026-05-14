import { createSlice } from "@reduxjs/toolkit";
import SessionHelper from "../../helpers/SessionHelper";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    // Directly hydrates from localStorage on app load
    AccessToken: SessionHelper.GetToken(), 
  },
  reducers: {
    SetLogin: (state, action) => {
      // action.payload should be the string token
      SessionHelper.SetToken(action.payload);
      state.AccessToken = action.payload;
    },
    SetLogout: (state) => {
      // 1. Clear Browser Storage
      SessionHelper.RemoveToken();
      SessionHelper.RemoveUserDetails();
      
      // 2. Clear Redux State
      state.AccessToken = null;

      // Note: We handle the clearing of UserDetails in the UserSlice 
      // by listening for this action or calling it separately.
    },
  },
});

export const { SetLogin, SetLogout } = AuthSlice.actions;
export default AuthSlice.reducer;