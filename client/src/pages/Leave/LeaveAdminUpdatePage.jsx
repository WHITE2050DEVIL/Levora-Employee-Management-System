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
import LeaveRequest from "../../APIRequest/LeaveRequest";

const LeaveAdminUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pulling details from the global Redux leave slice
  const { LeaveDetails } = useSelector((state) => state.Leave);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      LeaveRequest.LeaveDetails(id);
    }
  }, [searchParams]);

  /*
   * Form validation schema
   */
  const validationSchema = yup.object().shape({
    NumOfDay: yup
      .number()
      .typeError("Please enter a valid number")
      .required("Please Enter Number of Days")
      .min(1, "Days must be at least 1"),
    AdminStatus: yup.string().required("Please Select Admin Status"),
    AdminRemark: yup.string().required("Please Enter Admin Remark"),
  });

  /**
   * Handle the form submission
   */
  const CreateUpdateLeave = (values) => {
    const payload = {
      AdminStatus: values.AdminStatus,
      AdminRemark: values.AdminRemark,
      NumOfDay: Number(values.NumOfDay),
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

  // Dropdown options array configuration
  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

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
        title={!objectID ? "Create Leave Request" : "Process Leave Application"}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  {/* 👇 CRITICAL FIX: The key attribute forces the form to re-render 
                    and populate values smoothly when the API loading completes.
                  */}
                  <VerticalForm
                    key={LeaveDetails?._id || "create-mode"}
                    onSubmit={CreateUpdateLeave}
                    validationSchema={validationSchema}
                    defaultValues={LeaveDetails || {}}
                  >
                    <Row>
                      <Col xl={12}>
                        <FormInput
                          name="NumOfDay"
                          label={t("Number of Days")}
                          placeholder={t("Enter Number of Days")}
                          containerClass={"mb-3"}
                          type="number"
                        />

                        <FormInput
                          name="AdminStatus"
                          label={t("Admin Status")}
                          placeholder={t("Select Admin Status")}
                          containerClass={"mb-3"}
                          type="react-single-select"
                          options={statusOptions}
                          defaultValue={statusOptions.find(
                            (option) => option.value === LeaveDetails?.AdminStatus
                          ) || statusOptions[0]}
                        />
                      </Col>
                      
                      <Col xl={12}>
                        <FormInput
                          name="AdminRemark"
                          label={t("Admin Remark")}
                          placeholder={t("Enter Admin Remark")}
                          containerClass={"mb-3"}
                          type="simple-rich-edior" // Kept exact template filename mapping spelling
                        />
                      </Col>
                    </Row>
                    
                    <Row className="mt-3">
                      <Col>
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Add Leave") : t("Update Leave Status")}
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

export default LeaveAdminUpdatePage;