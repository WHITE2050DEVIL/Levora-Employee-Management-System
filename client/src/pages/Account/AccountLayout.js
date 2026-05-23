import React, { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// images
import Logo from "../../assets/images/logo.png";

const AccountLayout = ({ bottomLinks, children }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (document.body) document.body.classList.add("authentication-bg");

    return () => {
      if (document.body) document.body.classList.remove("authentication-bg");
    };
  }, []);

  return (
    <>
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <Container>
          <div className="hr-auth-shell">
            <div className="hr-auth-copy">
              <h1>{t("Run every HR workflow from one modern workspace.")}</h1>
              <p>
                {t(
                  "Manage staff records, departments, leave approvals, and account access with a cleaner employee management system."
                )}
              </p>
              <div className="hr-auth-points">
                <span>
                  <i className="mdi mdi-account-multiple-check-outline"></i>
                  {t("Role based access for Admin, HOD, and Staff")}
                </span>
                <span>
                  <i className="mdi mdi-calendar-check-outline"></i>
                  {t("Leave tracking with approval status visibility")}
                </span>
                <span>
                  <i className="mdi mdi-file-export-outline"></i>
                  {t("Directory and report exports for daily operations")}
                </span>
              </div>
            </div>

            <div className="hr-auth-card">
              <Card>
                <Card.Header className="pt-4 pb-4 text-center bg-primary">
                  <Link to="/">
                    <span>
                      <img src={Logo} alt="Employee Management System" height="18" />
                    </span>
                  </Link>
                </Card.Header>
                <Card.Body className="p-4">{children}</Card.Body>
              </Card>

              {bottomLinks}
            </div>
          </div>
        </Container>
      </div>
      <footer className="footer footer-alt">
        {t("Employee Management System")}
      </footer>
    </>
  );
};

export default AccountLayout;
