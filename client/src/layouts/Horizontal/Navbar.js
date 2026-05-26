// @flow
import React from "react";
import AppMenu from "./Menu";
import { Collapse } from "react-bootstrap";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { getMenuItems } from "../../helpers/menu";

const Navbar = (props) => {
  const { t } = useTranslation();
  const { UserDetails } = useSelector((state) => state.User);
  const { AccessToken } = useSelector((state) => state.Auth);
  const inputTheme = "light";
  const currentUser = Array.isArray(UserDetails) ? UserDetails[0] : UserDetails;
  const userRole = (currentUser?.Roles || "EMPLOYEE").toUpperCase();

  return (
    <>
      <div className="topnav shadow-sm">
        <div className="container-fluid">
          <nav
            className={classNames(
              "navbar",
              "navbar-expand-lg",
              "topnav-menu",
              "navbar-" + inputTheme,
            )}
          >
            <Collapse
              in={props.isMenuOpened}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <div>
                <AppMenu menuItems={getMenuItems(userRole, !!AccessToken, t)} />
              </div>
            </Collapse>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
