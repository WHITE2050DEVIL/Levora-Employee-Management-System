// @flow
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import { Dropdown } from "react-bootstrap";

// actions
import { ChangeLeftSideBarType, SetTheme } from "../redux/slices/SettingSlice";

// components
import LanguageDropdown from "../components/LanguageDropdown";
import NotificationDropdown from "../components/Ui/NotificationDropdown";
import ProfileDropdown from "../components/Ui/ProfileDropdown";
import SearchDropdown from "../components/Ui/SearchDropdown";
import TopbarSearch from "../components/Ui/TopbarSearch";
import AppsDropdown from "../components/AppsDropdown/";
import SummaryRequest from "../APIRequest/SummaryRequest";
import LevoraBrand from "../components/Brand/LevoraBrand";
import { BRAND_NAME } from "../constants/brand";

// images
import avatar1 from "../assets/images/users/avatar-2.jpg";
import defaultAvatar from "../assets/images/users/avatar-1.jpg";

//constants
import * as layoutConstants from "../redux/slices/SettingSlice";

const ProfileMenus = [
  {
    label: "My Account",
    icon: "mdi mdi-account-circle",
    redirectTo: "/account/profile",
  },
  {
    label: "Settings",
    icon: "mdi mdi-account-edit",
    redirectTo: "/account/setting",
  },
  {
    label: "Logout",
    icon: "mdi mdi-logout",
    redirectTo: "/account/logout",
  },
];

const Topbar = ({
  hideLogo,
  navCssClasses,
  openLeftMenuCallBack,
  topbarDark,
}) => {
  const dispatch = useDispatch();
  const [isopen, setIsopen] = useState(false);
  const [clock, setClock] = useState(new Date());

  const { UserDetails } = useSelector((state) => state.User);
  const { AccessToken } = useSelector((state) => state.Auth);
  const { SummaryLists } = useSelector((state) => state.Summary);
  const { LeaveLists } = useSelector((state) => state.Leave);
  const { LayoutType, LeftSideBarType, LayoutColor } = useSelector(
    (state) => state.Setting,
  );

  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const userFullName = [currentUser?.FirstName, currentUser?.LastName]
    .filter(Boolean)
    .join(" ");
  const username =
    userFullName || currentUser?.FullName || currentUser?.Email || "Admin User";
  const userTitle = currentUser?.Roles || "ADMIN";
  const profilePic = currentUser?.Image || defaultAvatar;

  const navbarCssClasses = navCssClasses || "";
  const containerCssClasses = !hideLogo ? "container-fluid" : "";

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!AccessToken || !userTitle) return;

    if (userTitle.toUpperCase() === "ADMIN") {
      SummaryRequest.DashboardSummaryAdmin();
    } else if (userTitle.toUpperCase() === "HOD") {
      SummaryRequest.DashboardSummaryHod();
    } else {
      SummaryRequest.DashboardSummaryEmployee();
    }
  }, [AccessToken, userTitle]);

  const notifications = useMemo(() => {
    const getCount = (status) =>
      SummaryLists?.find((summary) => summary?._id === status)?.count || 0;

    const pendingCount = getCount("Pending");
    const approvedCount = getCount("Approved");
    const rejectedCount = getCount("Rejected");

    const recentLeave = (LeaveLists || []).slice(0, 3).map((leave, index) => {
      const employee = leave?.Employee?.[0];
      const employeeName = [employee?.FirstName, employee?.LastName]
        .filter(Boolean)
        .join(" ");
      return {
        id: `leave-${leave?._id || index}`,
        title: employeeName || "Leave request",
        subText: `${employee?.Department || "Unassigned"} | ${employee?.Address || "No address"} | ${leave?.LeaveType || "Leave"} - HOD: ${leave?.HodStatus || "Pending"}, Admin: ${leave?.AdminStatus || "Pending"}`,
        time: "Recent",
        avatar: employee?.Image || avatar1,
        isRead: false,
      };
    });

    return [
      {
        day: "Leave Activity",
        messages: [
          {
            id: "pending-leave",
            title: "Pending leave",
            subText: `${pendingCount} request${pendingCount === 1 ? "" : "s"} require attention.`,
            time: "Now",
            icon: "mdi mdi-calendar-clock",
            variant: pendingCount > 0 ? "warning" : "secondary",
            isRead: pendingCount === 0,
          },
          {
            id: "approved-leave",
            title: "Approved leave",
            subText: `${approvedCount} request${approvedCount === 1 ? "" : "s"} approved.`,
            icon: "mdi mdi-check-circle-outline",
            variant: "success",
            isRead: true,
          },
          {
            id: "rejected-leave",
            title: "Rejected leave",
            subText: `${rejectedCount} request${rejectedCount === 1 ? "" : "s"} rejected.`,
            icon: "mdi mdi-close-circle-outline",
            variant: rejectedCount > 0 ? "danger" : "secondary",
            isRead: rejectedCount === 0,
          },
          ...recentLeave,
        ],
      },
    ];
  }, [LeaveLists, SummaryLists]);

  const handleLeftMenuCallBack = () => {
    setIsopen((prevState) => !prevState);
    if (openLeftMenuCallBack) openLeftMenuCallBack();

    switch (LayoutType) {
      case layoutConstants.LAYOUT_VERTICAL:
        if (window.innerWidth >= 768) {
          if (LeftSideBarType === "fixed" || LeftSideBarType === "scrollable")
            dispatch(
              ChangeLeftSideBarType(
                layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED,
              ),
            );
          if (LeftSideBarType === "condensed")
            dispatch(
              ChangeLeftSideBarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED),
            );
        }
        break;

      case layoutConstants.LAYOUT_FULL:
        if (document.body) {
          document.body.classList.toggle("hide-menu");
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={classNames("navbar-custom hr-topbar", navbarCssClasses)}>
        <div className={containerCssClasses}>
          {!hideLogo && (
            <Link to="/" className="topnav-logo">
              <LevoraBrand showTagline={false} className="hr-topbar-brand" />
            </Link>
          )}

          <div className="hr-topbar-context d-none d-md-flex">
            {hideLogo && (
              <span className="hr-topbar-brand-inline d-none d-xl-inline-flex">
                <span className="hr-topbar-brand-label">{BRAND_NAME}</span>
              </span>
            )}
            <span className="hr-topbar-time">
              <i className="mdi mdi-clock-time-four-outline me-1"></i>
              {clock.toLocaleDateString()}{" "}
              {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <Dropdown>
              <Dropdown.Toggle variant="light" size="sm">
                <i className="mdi mdi-plus-circle-outline me-1"></i>
                Quick Create
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/employee/employee-create-update">
                  New Employee
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/department/department-create-update">
                  New Department
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/leave/leave-create-update">
                  New Leave Request
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <ul className="list-unstyled topbar-menu float-end mb-0">
            <li className="notification-list topbar-dropdown d-xl-none">
              <SearchDropdown />
            </li>
            <li className="dropdown notification-list topbar-dropdown d-none d-lg-block">
              <LanguageDropdown />
            </li>
            <li className="dropdown notification-list">
              <NotificationDropdown notifications={notifications} />
            </li>
            <li className="dropdown notification-list d-none d-sm-inline-block">
              <AppsDropdown />
            </li>
            <li className="notification-list">
              {LayoutColor === "light" ? (
                <button
                  className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
                  onClick={() => dispatch(SetTheme("dark"))}
                >
                  <i className="uil-moon noti-icon"></i>
                </button>
              ) : (
                <button
                  className="nav-link dropdown-toggle end-bar-toggle arrow-none btn btn-link shadow-none"
                  onClick={() => dispatch(SetTheme("light"))}
                >
                  <i className="uil-sun noti-icon"></i>
                </button>
              )}
            </li>
            <li className="dropdown notification-list">
              <ProfileDropdown
                profilePic={profilePic}
                menuItems={ProfileMenus}
                username={username}
                userTitle={userTitle}
              />
            </li>
          </ul>

          {(LayoutType === layoutConstants.LAYOUT_VERTICAL ||
            LayoutType === layoutConstants.LAYOUT_FULL) && (
            <button
              className="button-menu-mobile open-left"
              onClick={handleLeftMenuCallBack}
            >
              <i className="mdi mdi-menu" />
            </button>
          )}

          {LayoutType === layoutConstants.LAYOUT_HORIZONTAL && (
            <Link
              to="#"
              className={classNames("navbar-toggle", { open: isopen })}
              onClick={handleLeftMenuCallBack}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          )}

          {LayoutType === layoutConstants.LAYOUT_DETACHED && (
            <Link
              to="#"
              className="button-menu-mobile disable-btn"
              onClick={handleLeftMenuCallBack}
            >
              <div className="lines">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </Link>
          )}
          <TopbarSearch />
        </div>
      </div>
    </>
  );
};

export default Topbar;
