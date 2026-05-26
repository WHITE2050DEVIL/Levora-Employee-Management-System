// @flow
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import { useTranslation } from "react-i18next";

import { getMenuItems } from "../helpers/menu";

// components
import AppMenu from "./Menu";
import defaultAvatar from "../assets/images/users/avatar-1.jpg";
import LevoraBrand from "../components/Brand/LevoraBrand";

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
  const { t } = useTranslation();
  const { UserDetails } = useSelector((state) => state.User);
  const { AccessToken } = useSelector((state) => state.Auth);
  const [menuSearch, setMenuSearch] = useState("");
  const hasSearch = menuSearch.trim().length > 0;
  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const fullName =
    [currentUser?.FirstName, currentUser?.LastName].filter(Boolean).join(" ") ||
    currentUser?.FullName ||
    "System User";
  const menuItems = useMemo(
    () => filterMenuTree(getMenuItems(userRole, !!AccessToken, t), menuSearch),
    [AccessToken, menuSearch, t, userRole]
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
        <div className="position-relative hr-sidebar-search">
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
          {hasSearch && (
            <button
              type="button"
              className="btn btn-link p-0 hr-sidebar-search-clear"
              onClick={() => setMenuSearch("")}
              aria-label="Clear menu search"
            >
              <i className="mdi mdi-close-circle-outline"></i>
            </button>
          )}
        </div>
      </div>

      {menuItems.length > 0 ? (
        <AppMenu menuItems={menuItems} />
      ) : (
        <div className="px-3 pb-4 text-muted small">
          No menu items found for this search.
        </div>
      )}
      <div className="clearfix" />
    </>
  );
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }) => {
  const menuNodeRef = useRef(null);
  
  // Connect Redux memory to check the User's explicit access role
  const { UserDetails } = useSelector((state) => state.User);
  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const userRole = (currentUser?.Roles || "EMPLOYEE").toUpperCase();

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
          <LevoraBrand compact={isCondensed} showTagline={!isCondensed} />
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
