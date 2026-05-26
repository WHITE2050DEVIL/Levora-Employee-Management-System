import { createSlice } from "@reduxjs/toolkit";
import SessionHelper from "../../helpers/SessionHelper";

const UserSlice = createSlice({
  name: "User",
  initialState: { 
    // Pulls data from localStorage immediately on refresh
    UserDetails: SessionHelper.GetUserDetails() 
  },
  reducers: {
    SetUserDetails(state, action) {
      // Ensure we aren't saving empty/null data accidentally
      if (action.payload) {
        SessionHelper.SetUserDetails(action.payload);
        state.UserDetails = action.payload;
      }
    },
    RemoveUserDetails(state) {
      // Full cleanup: Storage + Redux State
      SessionHelper.RemoveUserDetails();
      state.UserDetails = null;
    },
  },
});

export const { SetUserDetails, RemoveUserDetails } = UserSlice.actions;
export default UserSlice.reducer;