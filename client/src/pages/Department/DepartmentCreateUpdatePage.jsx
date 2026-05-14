// External Lib Import
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button } from "react-bootstrap";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import { FormInput, VerticalForm } from "../../components/Ui";
import DepartmentRequest from "../../APIRequest/DepartmentRequest";

const DepartmentCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Connect to the global Redux state slice
  const { DepartmentDetails } = useSelector((state) => state.Department);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      DepartmentRequest.DepartmentDetails(id);
    }
  }, [searchParams]);

  /*
   * Form validation schema matrix
   */
  const validationSchema = yup.object().shape({
    DepartmentName: yup.string().required(t("Please Enter Department Name")),
    DepartmentShortName: yup.string().required(t("Please Enter Department Short Name")),
  });

  /**
   * Handle the form submission wrapper
   */
  const CreateUpdateDepartment = (values) => {
    const payload = {
      DepartmentName: values.DepartmentName,
      DepartmentShortName: values.DepartmentShortName,
      DepartmentDetails: values.DepartmentDetails || "",
      DepartmentStatus: !!values.DepartmentStatus, // Forces checkbox output to a clean Boolean format
    };

    if (!objectID) {
      DepartmentRequest.DepartmentCreate(payload).then((result) => {
        if (result) {
          navigate("/department/department-list");
        }
      });
    } else {
      DepartmentRequest.DepartmentUpdate(objectID, payload).then((result) => {
        if (result) {
          navigate("/department/department-list");
        }
      });
    }
  };

  // Explicit initialization values to prevent controlled component layout flashing
  const formDefaults = objectID 
    ? DepartmentDetails 
    : { DepartmentName: "", DepartmentShortName: "", DepartmentDetails: "", DepartmentStatus: true };

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
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <VerticalForm
                    key={objectID ? DepartmentDetails?._id || "edit-mode" : "create-mode"}
                    onSubmit={CreateUpdateDepartment}
                    validationSchema={validationSchema}
                    defaultValues={formDefaults}
                  >
                    <Row>
                      <Col xs={12}>
                        <FormInput
                          name="DepartmentName"
                          label={t("Department Name")}
                          placeholder={t("Enter Department Name")}
                          containerClass={"mb-3"}
                        />
                        
                        <FormInput
                          name="DepartmentShortName"
                          label={t("Department Short Name")}
                          placeholder={t("Enter Department Short Name")}
                          containerClass={"mb-3"}
                        />

                        <FormInput
                          name="DepartmentDetails"
                          label={t("Department Details")}
                          placeholder={t("Enter Department Details")}
                          containerClass={"mb-3"}
                          // ⚠️ NOTE: If the rich text editor component doesn't show up, 
                          // change "simple-rich-editor" back to "simple-rich-edior" (matching your UI component's file spelling)
                          type="simple-rich-editor" 
                        />

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
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Add Department") : t("Update Department")}
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DepartmentCreateUpdatePage;