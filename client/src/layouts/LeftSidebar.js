// @flow
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import defaultAvatar from "../assets/images/users/avatar-1.jpg";

const filterMenuTree = (items, query) => {
  if (!query) return items;
  const q = query.toLowerCase();
  return (items || [])
    .map((item) => {
      const hasLabel = item?.label?.toLowerCase().includes(q);
      const children = item.children ? filterMenuTree(item.children, query) : [];
      if (item.isTitle) return item;
      if (hasLabel || children.length > 0) {
        return { ...item, children };
      }
      return null;
    })
    .filter(Boolean);
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile, userRole }) => {
  const { UserDetails } = useSelector((state) => state.User);
  const [menuSearch, setMenuSearch] = useState("");
  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const fullName =
    [currentUser?.FirstName, currentUser?.LastName].filter(Boolean).join(" ") ||
    currentUser?.FullName ||
    "System User";
  const menuItems = useMemo(
    () => filterMenuTree(getMenuItems(userRole), menuSearch),
    [menuSearch, userRole]
  );

  return (
    <>
      {!hideUserProfile && (
        <div className="leftbar-user hr-leftbar-user">
          <Link to="/account/profile">
            <img
              src={currentUser?.Image || defaultAvatar}
              alt="user"
              className="rounded-circle mb-2"
              style={{ width: "44px", height: "44px", objectFit: "cover" }}
              onError={(event) => {
                event.currentTarget.src = defaultAvatar;
              }}
            />
            <span className="leftbar-user-name fw-bold text-primary">{fullName}</span>
            <small className="d-block text-muted">({userRole || "EMPLOYEE"})</small>
          </Link>
        </div>
      )}

      <div className="px-3 pt-2 pb-3">
        <div className="position-relative">
          <i
            className="mdi mdi-magnify position-absolute"
            style={{ top: "11px", left: "12px", color: "#94a3b8" }}
          />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: "34px" }}
            placeholder="Search menu..."
            value={menuSearch}
            onChange={(event) => setMenuSearch(event.target.value)}
          />
        </div>
      </div>

      <AppMenu menuItems={menuItems} />
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
