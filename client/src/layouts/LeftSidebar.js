// @flow
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";

import { getMenuItems } from "../helpers/menu";

// components
import AppMenu from "./Menu";

// images
import logoSm from "../assets/images/logo_sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoDarkSm from "../assets/images/logo_sm_dark.png";
import logo from "../assets/images/logo.png";

/* sidebar content */
const SideBarContent = ({ hideUserProfile, userRole }) => {
  const { UserDetails } = useSelector((state) => state.User);

  return (
    <>
      {!hideUserProfile && (
        <div className="leftbar-user">
          <Link to="/account/profile">
            <span className="leftbar-user-name fw-bold text-primary">
              {UserDetails?.FullName || "System User"}
            </span>
            <small className="d-block text-muted">({userRole || "EMPLOYEE"})</small>
          </Link>
        </div>
      )}
      {/* Pass the dynamic role-filtered menu items to the AppMenu layout */}
      <AppMenu menuItems={getMenuItems(userRole)} />
      <div className="clearfix" />
    </>
  );
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }) => {
  const menuNodeRef = useRef(null);
  
  // Connect Redux memory to check the User's explicit access role
  const { UserDetails } = useSelector((state) => state.User);
  const userRole = UserDetails?.Roles || "EMPLOYEE";

  const handleOtherClick = (e: any) => {
    if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
    if (document.body) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOtherClick, false);
    return () => {
      document.removeEventListener("mousedown", handleOtherClick, false);
    };
  }, []);

  return (
    <div className="leftside-menu" ref={menuNodeRef}>
      {!hideLogo && (
        <Link to="/" className="logo text-center logo-light d-block py-3">
          <span className="logo-lg">
            <img src={isLight ? logoDark : logo} alt="logo" height="20" />
          </span>
          <span className="logo-sm">
            <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="20" />
          </span>
        </Link>
      )}

      {!isCondensed ? (
        <SimpleBar style={{ maxHeight: "100%" }} timeout={500} scrollbarMaxSize={320}>
          <SideBarContent hideUserProfile={hideUserProfile} userRole={userRole} />
        </SimpleBar>
      ) : (
        <SideBarContent hideUserProfile={hideUserProfile} userRole={userRole} />
      )}
    </div>
  );
};

LeftSidebar.defaultProps = {
  hideLogo: false,
  hideUserProfile: false,
  isLight: false,
  isCondensed: false,
};

export default LeftSidebar;