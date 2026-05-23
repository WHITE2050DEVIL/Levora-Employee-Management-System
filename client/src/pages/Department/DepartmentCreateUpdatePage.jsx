// External Lib Import
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button, Badge } from "react-bootstrap";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import { FormInput, VerticalForm } from "../../components/Ui";
import DepartmentRequest from "../../APIRequest/DepartmentRequest";

const DepartmentCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { DepartmentDetails } = useSelector((state) => state.Department);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      DepartmentRequest.DepartmentDetails(id);
    }
  }, [searchParams]);

  const validationSchema = yup.object().shape({
    DepartmentName: yup
      .string()
      .trim()
      .required(t("Please Enter Department Name"))
      .min(3, t("Department Name should be at least 3 characters")),
    DepartmentShortName: yup
      .string()
      .trim()
      .required(t("Please Enter Department Short Name"))
      .max(8, t("Short Name should not exceed 8 characters")),
  });

  const buildShortName = (name) => {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 8);
  };

  const formDefaults = useMemo(
    () =>
      objectID
        ? DepartmentDetails
        : {
            DepartmentName: "",
            DepartmentShortName: "",
            DepartmentDetails: "",
            DepartmentStatus: true,
          },
    [DepartmentDetails, objectID]
  );

  const createUpdateDepartment = async (values) => {
    if (isSaving) return;
    setIsSaving(true);

    const payload = {
      DepartmentName: values.DepartmentName?.trim(),
      DepartmentShortName:
        values.DepartmentShortName?.trim() || buildShortName(values.DepartmentName),
      DepartmentDetails: values.DepartmentDetails || "",
      DepartmentStatus: !!values.DepartmentStatus,
    };

    const result = !objectID
      ? await DepartmentRequest.DepartmentCreate(payload)
      : await DepartmentRequest.DepartmentUpdate(objectID, payload);

    if (result) {
      navigate("/department/department-list");
    }
    setIsSaving(false);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Department", path: "/department/department-list" },
          {
            label: !objectID ? "Create Department" : "Update Department",
            path: "/department/department-list",
            active: true,
          },
        ]}
        title={!objectID ? t("Create Department") : t("Update Department")}
      />

      <Row>
        <Col xs={12}>
          <Card className="hr-form-card">
            <Card.Body>
              <div className="hr-list-header">
                <div>
                  <h4>{!objectID ? "Department Setup" : "Department Update"}</h4>
                  <p>Create and maintain department identity, visibility, and notes.</p>
                </div>
                <Badge bg={formDefaults.DepartmentStatus ? "success" : "secondary"}>
                  {formDefaults.DepartmentStatus ? "Active" : "Inactive"}
                </Badge>
              </div>

              <VerticalForm
                key={objectID ? DepartmentDetails?._id || "edit-mode" : "create-mode"}
                onSubmit={createUpdateDepartment}
                validationSchema={validationSchema}
                defaultValues={formDefaults}
              >
                <Row>
                  <Col md={6}>
                    <FormInput
                      name="DepartmentName"
                      label={t("Department Name")}
                      placeholder={t("Enter Department Name (e.g. Human Resources)")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      name="DepartmentShortName"
                      label={t("Department Short Name")}
                      placeholder={t("Enter Department Short Name (e.g. HR)")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <FormInput
                      name="DepartmentDetails"
                      label={t("Department Details")}
                      placeholder={t("Describe scope, goals, and ownership of this department")}
                      containerClass={"mb-3"}
                      type="simple-rich-edior"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <FormInput
                      name="DepartmentStatus"
                      label={t("Active Status")}
                      containerClass={"mb-3"}
                      type="checkbox"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Button type="submit" variant="primary" className="me-2" disabled={isSaving}>
                      {isSaving
                        ? t("Saving...")
                        : !objectID
                          ? t("Add Department")
                          : t("Update Department")}
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate("/department/department-list")}
                    >
                      {t("Cancel")}
                    </Button>
                  </Col>
                </Row>
              </VerticalForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentCreateUpdatePage;
