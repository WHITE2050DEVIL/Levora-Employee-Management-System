// External Lib Import
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button } from "react-bootstrap";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom"; // Hooks updated standard

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import { FormInput, VerticalForm } from "../../components/Ui";
import LeaveRequest from "../../APIRequest/LeaveRequest";
import LeaveTypeRequest from "../../APIRequest/LeaveTypeRequest";

const LeaveCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Fixed vanilla URL window parameters parsing

  // Sync with global Redux state slices
  const { LeaveDetails } = useSelector((state) => state.Leave);
  const { LeaveTypeDropDown } = useSelector((state) => state.LeaveType);

  useEffect(() => {
    // Fire the dropdown selector population immediately on mount
    LeaveTypeRequest.LeaveTypeDropDown();
    
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      LeaveRequest.LeaveDetails(id);
    }
  }, [searchParams]);

  /*
   * Form validation schema matrix
   */
  const validationSchema = yup.object().shape({
    LeaveType: yup.string().required(t("Please Select Leave Type")),
    NumOfDay: yup
      .number()
      .typeError(t("Please enter a valid number"))
      .required(t("Please Enter Num Of Day"))
      .min(1, t("Days must be at least 1")),
    StartLeaveDate: yup.string().required(t("Please Enter Start Leave Date")),
    EndLeaveDate: yup.string().required(t("Please Enter End Leave Date")),
    LeaveDetails: yup.string().required(t("Please Enter Leave Details")),
  });

  /**
   * Handle the form submission data layer payload
   */
  const CreateUpdateLeave = (values) => {
    const payload = {
      LeaveType: values.LeaveType,
      NumOfDay: Number(values.NumOfDay),
      StartLeaveDate: values.StartLeaveDate,
      EndLeaveDate: values.EndLeaveDate,
      LeaveDetails: values.LeaveDetails,
    };

    if (!objectID) {
      LeaveRequest.LeaveCreate(payload).then((result) => {
        if (result) {
          navigate("/leave/leave-list");
        }
      });
    } else {
      LeaveRequest.LeaveUpdate(objectID, payload).then((result) => {
        if (result) {
          navigate("/leave/leave-list");
        }
      });
    }
  };

  // 👇 FIXED CRASH: Structural object protection baseline safeguards Formik mutations
  const formDefaults = objectID && LeaveDetails && typeof LeaveDetails === "object"
    ? LeaveDetails
    : {
        LeaveType: "",
        NumOfDay: "",
        StartLeaveDate: "",
        EndLeaveDate: "",
        LeaveDetails: "",
      };

  // Monitors the loading state length of your dropdown array
  const dropdownLength = LeaveTypeDropDown?.length || 0;

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Leave", path: "/leave/leave-list" },
          {
            label: !objectID ? "Create Leave" : "Update Leave",
            path: "/leave/leave-list",
            active: true,
          },
        ]}
        title={!objectID ? t("Create Leave Application") : t("Update Leave Details")}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  {/* 👇 FIXED DROP-DOWN LOCK OUT BUG: 
                      Forces structural re-mount the millisecond the API updates your Redux storage layout options!
                  */}
                  <VerticalForm
                    key={objectID ? `edit-${LeaveDetails?._id || "mode"}-${dropdownLength}` : `create-${dropdownLength}`}
                    onSubmit={CreateUpdateLeave}
                    validationSchema={validationSchema}
                    defaultValues={formDefaults}
                  >
                    <Row>
                      <Col md={6}>
                        {/* 👇 FIXED SAFELY: Added optional chaining verification to prevent undefined runtime crashes */}
                        <FormInput
                          name="LeaveType"
                          label={t("Leave Type Category")}
                          placeholder={t("Select Leave Type")}
                          containerClass={"mb-3"}
                          type="react-single-select"
                          options={LeaveTypeDropDown || []}
                          defaultValue={LeaveTypeDropDown?.find(
                            (i) => i.value === LeaveDetails?.LeaveType
                          )}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          name="NumOfDay"
                          label={t("Num Of Day")}
                          placeholder={t("Enter Num Of Day")}
                          containerClass={"mb-3"}
                          type="number"
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} lg={6} xl={6} xs={12}>
                        <FormInput
                          type="date"
                          name="StartLeaveDate"
                          label={t("Start Leave Date")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                      <Col md={6} lg={6} xl={6} xs={12}>
                        <FormInput
                          type="date"
                          name="EndLeaveDate"
                          label={t("End Leave Date")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <FormInput
                          type="simple-rich-edior" // Kept original filename spelling reference
                          name="LeaveDetails"
                          label={t("Leave Details Explanation")}
                          placeholder={t("Enter details regarding your leave request justification...")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Submit Application") : t("Save Form Modifications")}
                        </Button>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => navigate("/leave/leave-list")}
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

export default LeaveCreateUpdatePage;