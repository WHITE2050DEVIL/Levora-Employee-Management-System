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
import EmployeeRequest from "../../APIRequest/EmployeeRequest";
import { defaultAvatarImg } from "../../helpers/Default";
import DepartmentRequest from "../../APIRequest/DepartmentRequest";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

const roleOptions = [
  { value: "STAFF", label: "STAFF" },
  { value: "HOD", label: "HOD" },
  { value: "ADMIN", label: "ADMIN" },
];

const EmployeeCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { EmployeeDetails } = useSelector((state) => state.Employee);
  const { DepartmentDropDown } = useSelector((state) => state.Department);

  const [previewImg, setPreviewImg] = useState(defaultAvatarImg);

  useEffect(() => {
    DepartmentRequest.DepartmentDropDown();
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      EmployeeRequest.EmployeeDetails(id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (objectID && EmployeeDetails?.Image) {
      setPreviewImg(EmployeeDetails.Image);
    } else if (!objectID) {
      setPreviewImg(defaultAvatarImg);
    }
  }, [EmployeeDetails, objectID]);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        DepartmentId: yup.string().required(t("Please Select Department")),
        FirstName: yup
          .string()
          .trim()
          .required(t("Please Enter First Name"))
          .min(2, t("First Name should be at least 2 characters")),
        LastName: yup
          .string()
          .trim()
          .required(t("Please Enter Last Name")),
        Gender: yup.string().required(t("Please Select Gender")),
        Phone: yup
          .string()
          .required(t("Please Enter Phone"))
          .min(8, t("Phone number seems too short")),
        Email: yup
          .string()
          .email(t("Please enter a valid email"))
          .required(t("Please Enter Email")),
        Password: objectID
          ? yup.string().nullable()
          : yup
              .string()
              .required(t("Please Enter Password"))
              .min(6, t("Password should be at least 6 characters")),
        Roles: yup.string().required(t("Please Select a Role")),
        DateOfBirth: yup
          .date()
          .typeError(t("Please Enter Date Of Birth"))
          .required(t("Please Enter Date Of Birth"))
          .max(new Date(), t("Date Of Birth cannot be in the future")),
        Address: yup
          .string()
          .trim()
          .required(t("Please Enter Address"))
          .min(8, t("Address should be more descriptive")),
      }),
    [objectID, t]
  );

  const formDefaults = objectID && EmployeeDetails
    ? EmployeeDetails
    : {
        DepartmentId: "",
        FirstName: "",
        LastName: "",
        Gender: "",
        Phone: "",
        Email: "",
        Password: "",
        Roles: "STAFF",
        DateOfBirth: "",
        Address: "",
      };

  const createUpdateEmployee = async (values) => {
    if (isSaving) return;
    setIsSaving(true);

    const payload = {
      DepartmentId: values.DepartmentId,
      FirstName: values.FirstName?.trim(),
      LastName: values.LastName?.trim(),
      Gender: values.Gender,
      DateOfBirth: values.DateOfBirth,
      Address: values.Address?.trim(),
      Phone: values.Phone,
      Email: values.Email?.trim(),
      Roles: values.Roles,
      Image: previewImg || defaultAvatarImg,
    };

    if (!objectID || values.Password) {
      payload.Password = values.Password;
    }

    const result = !objectID
      ? await EmployeeRequest.EmployeeCreate(payload)
      : await EmployeeRequest.EmployeeUpdate(objectID, payload);

    if (result) {
      navigate("/employee/employee-list");
    }
    setIsSaving(false);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Employee", path: "/employee/employee-list" },
          {
            label: !objectID ? "Create Employee" : "Update Employee",
            path: "/employee/employee-list",
            active: true,
          },
        ]}
        title={!objectID ? t("Create Employee Account") : t("Update Employee Profile")}
      />

      <Row>
        <Col xs={12}>
          <Card className="hr-form-card">
            <Card.Body>
              <div className="hr-list-header">
                <div>
                  <h4>{!objectID ? "Employee Onboarding" : "Employee Maintenance"}</h4>
                  <p>Capture identity, role access, and profile details in one place.</p>
                </div>
                <Badge bg="info">HR Form</Badge>
              </div>

              <VerticalForm
                key={objectID ? EmployeeDetails?._id || "edit-mode" : "create-mode"}
                onSubmit={createUpdateEmployee}
                validationSchema={validationSchema}
                defaultValues={formDefaults}
              >
                <Row className="mb-4 text-center text-sm-start">
                  <Col>
                    <div className="d-sm-flex align-items-center">
                      <img
                        src={previewImg}
                        alt="Employee Avatar"
                        className="rounded-circle avatar-xl img-thumbnail mb-2 mb-sm-0 me-sm-3"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <div className="w-100 max-w-sm">
                        <FormInput
                          name="Image"
                          label={t("Upload Profile Picture")}
                          type="file"
                          containerClass={"mb-0"}
                          onChange={(img) => setPreviewImg(img)}
                        />
                      </div>
                    </div>
                    <hr className="mt-4" />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <FormInput
                      name="DepartmentId"
                      label={t("Assign Department")}
                      placeholder={t("Select Department")}
                      containerClass={"mb-3"}
                      type="react-single-select"
                      options={DepartmentDropDown}
                      defaultValue={DepartmentDropDown?.find(
                        (i) => i.value === EmployeeDetails?.DepartmentId
                      )}
                    />
                  </Col>
                  <Col xl={6}>
                    <FormInput
                      name="Roles"
                      label={t("System Access Role")}
                      placeholder={t("Select Roles")}
                      containerClass={"mb-3"}
                      type="react-single-select"
                      options={roleOptions}
                      defaultValue={roleOptions.find((i) => i.value === EmployeeDetails?.Roles)}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <FormInput
                      name="FirstName"
                      label={t("First Name")}
                      placeholder={t("Enter First Name")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                  <Col xl={6}>
                    <FormInput
                      name="LastName"
                      label={t("Last Name")}
                      placeholder={t("Enter Last Name")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <FormInput
                      name="Gender"
                      label={t("Gender")}
                      placeholder={t("Select Gender")}
                      containerClass={"mb-3"}
                      type="react-single-select"
                      options={genderOptions}
                      defaultValue={genderOptions.find((i) => i.value === EmployeeDetails?.Gender)}
                    />
                  </Col>
                  <Col xl={6}>
                    <FormInput
                      type="date"
                      name="DateOfBirth"
                      label={t("Date of Birth")}
                      containerClass={"mb-3"}
                      placeholder={t("Select Date Of Birth")}
                      maxDate={new Date()}
                      dateFormat="dd MMM yyyy"
                      showMonthDropdown={true}
                      showYearDropdown={true}
                      dropdownMode="select"
                      yearDropdownItemNumber={100}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <FormInput
                      name="Phone"
                      label={t("Phone Number")}
                      placeholder={t("Enter Phone")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                  <Col xl={6}>
                    <FormInput
                      name="Email"
                      label={t("Email Address")}
                      placeholder={t("Enter Email")}
                      containerClass={"mb-3"}
                      type="email"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xl={6}>
                    <FormInput
                      type="password"
                      name="Password"
                      label={objectID ? t("Reset Password (Optional)") : t("Account Password")}
                      placeholder={objectID ? t("Leave blank to keep existing password") : t("Enter Password")}
                      containerClass={"mb-3"}
                    />
                  </Col>
                  <Col xl={6}>
                    <FormInput
                      name="Address"
                      label={t("Residential Address")}
                      placeholder={t("Enter Address")}
                      containerClass={"mb-3"}
                      type="textarea"
                    />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col>
                    <Button type="submit" variant="primary" className="me-2" disabled={isSaving}>
                      {isSaving
                        ? t("Saving...")
                        : !objectID
                          ? t("Add Employee")
                          : t("Update Profile")}
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate("/employee/employee-list")}
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

export default EmployeeCreateUpdatePage;
