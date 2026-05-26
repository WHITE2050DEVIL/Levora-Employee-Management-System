//External Lib Import
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button } from "react-bootstrap";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

//Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import { FormInput, VerticalForm } from "../../components/Ui";
import UnitRequest from "../../APIRequest/UnitRequest";

const UnitCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Connect to the global Redux unit state slice
  const { UnitDetails } = useSelector((state) => state.Unit);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      UnitRequest.UnitDetails(id);
    }
  }, [searchParams]);

  /*
   * Form validation schema
   */
  const validationSchema = yup.object().shape({
    UnitName: yup.string().required(t("Please Enter Unit Name")),
  });

  /**
   * Handle the form submission wrapper
   */
  const CreateUpdateUnit = (values) => {
    const payload = {
      UnitName: values.UnitName,
      UnitDetails: values.UnitDetails || "",
      UnitStatus: !!values.UnitStatus, // Forces checkbox status cleanly into a Boolean value
    };

    if (!objectID) {
      UnitRequest.UnitCreate(payload).then((result) => {
        if (result) {
          navigate("/unit/unit-list");
        }
      });
    } else {
      UnitRequest.UnitUpdate(objectID, payload).then((result) => {
        if (result) {
          navigate("/unit/unit-list");
        }
      });
    }
  };

  // Structured default initializations to guarantee input field stability
  const formDefaults = objectID && UnitDetails
    ? UnitDetails
    : { UnitName: "", UnitDetails: "", UnitStatus: true };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Unit", path: "/unit/unit-list" },
          {
            label: !objectID ? "Create Unit" : "Update Unit",
            path: "/unit/unit-list",
            active: true,
          },
        ]}
        title={!objectID ? t("Create Unit") : t("Update Unit Details")}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  {/* 👇 FIXED: Added a structural lifecycle key property to trigger 
                      re-renders automatically upon API completion.
                  */}
                  <VerticalForm
                    key={objectID ? UnitDetails?._id || "edit-mode" : "create-mode"}
                    onSubmit={CreateUpdateUnit}
                    validationSchema={validationSchema}
                    defaultValues={formDefaults}
                  >
                    <Row>
                      <Col xs={12}>
                        <FormInput
                          name="UnitName"
                          label={t("Unit Name")}
                          placeholder={t("Enter Unit Name")}
                          containerClass={"mb-3"}
                        />

                        <FormInput
                          name="UnitDetails"
                          label={t("Unit Details")}
                          placeholder={t("Enter Unit Details")}
                          containerClass={"mb-3"}
                          // ⚠️ NOTE: Left exact original spelling string "simple-rich-edior" 
                          // to keep custom internal layout mapping components stable.
                          type="simple-rich-edior" 
                        />

                        <FormInput
                          name="UnitStatus"
                          label={t("Active Status")}
                          containerClass={"mb-3"}
                          type="checkbox"
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Add Unit") : t("Update Unit")}
                        </Button>
                        <Button 
                          type="button" 
                          variant="light" 
                          onClick={() => navigate("/unit/unit-list")}
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

export default UnitCreateUpdatePage;