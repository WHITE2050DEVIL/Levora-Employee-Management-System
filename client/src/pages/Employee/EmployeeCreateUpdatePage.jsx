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
import EmployeeRequest from "../../APIRequest/EmployeeRequest";
import { defaultAvatarImg } from "../../helpers/Default";
import DepartmentRequest from "../../APIRequest/DepartmentRequest";

const EmployeeCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Connect to Redux global state slices
  const { EmployeeDetails } = useSelector((state) => state.Employee);
  const { DepartmentDropDown } = useSelector((state) => state.Department);

  // Initialize avatar state with standard system placeholder icon
  const [previewImg, setPreviewImg] = useState(defaultAvatarImg);

  // 1. Initial Load Effect: Fetch configuration dependencies and item IDs
  useEffect(() => {
    DepartmentRequest.DepartmentDropDown();
    
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      EmployeeRequest.EmployeeDetails(id);
    }
  }, [searchParams]);

  // 2. 👇 FIXED: State Synchronization Effect for Profile Images
  // Listens directly to Redux and updates the picture preview when the network data payload lands
  useEffect(() => {
    if (objectID && EmployeeDetails?.Image) {
      setPreviewImg(EmployeeDetails.Image);
    } else if (!objectID) {
      setPreviewImg(defaultAvatarImg); // Reset to default if clicking "Add Employee"
    }
  }, [EmployeeDetails, objectID]);

  /*
   * Form validation schema matrix
   */
  const validationSchema = yup.object().shape({
    DepartmentId: yup.string().required(t("Please Select Department")),
    FirstName: yup.string().required(t("Please Enter First Name")),
    LastName: yup.string().required(t("Please Enter Last Name")),
    Gender: yup.string().required(t("Please Select Gender")),
    Phone: yup.string().required(t("Please Enter Phone")),
    Email: yup.string().email(t("Please enter a valid email")).required(t("Please Enter Email")),
    Password: yup.string().required(t("Please Enter Password")),
    Roles: yup.string().required(t("Please Select a Role")),
    DateOfBirth: yup.string().required(t("Please Enter Date Of Birth")),
    Address: yup.string().required(t("Please Enter Address")),
  });

  /**
   * Handle the form submission wrapper
   */
  const CreateUpdateEmployee = (values) => {
    const payload = {
      DepartmentId: values.DepartmentId,
      FirstName: values.FirstName,
      LastName: values.LastName,
      Gender: values.Gender,
      DateOfBirth: values.DateOfBirth,
      Address: values.Address,
      Phone: values.Phone,
      Email: values.Email,
      Password: values.Password,
      Roles: values.Roles,
      Image: previewImg || defaultAvatarImg, // Bind current preview state payload
    };

    if (!objectID) {
      EmployeeRequest.EmployeeCreate(payload).then((result) => {
        if (result) {
          navigate("/employee/employee-list");
        }
      });
    } else {
      EmployeeRequest.EmployeeUpdate(objectID, payload).then((result) => {
        if (result) {
          navigate("/employee/employee-list");
        }
      });
    }
  };

  // Structured default dictionaries to guarantee form input stability
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
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <VerticalForm
                    key={objectID ? EmployeeDetails?._id || "edit-mode" : "create-mode"}
                    onSubmit={CreateUpdateEmployee}
                    validationSchema={validationSchema}
                    defaultValues={formDefaults}
                  >
                    {/* AVATAR HEADER ROW */}
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

                    {/* IDENTITY DATA SECTION */}
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
                          name="FirstName"
                          label={t("First Name")}
                          placeholder={t("Enter First Name")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={6}>
                        <FormInput
                          name="LastName"
                          label={t("Last Name")}
                          placeholder={t("Enter Last Name")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                      <Col xl={6}>
                        <FormInput
                          name="Gender"
                          label={t("Gender")}
                          placeholder={t("Select Gender")}
                          containerClass={"mb-3"}
                          type="react-single-select"
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Others", label: "Others" },
                          ]}
                          defaultValue={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Others", label: "Others" },
                          ].find((i) => i.value === EmployeeDetails?.Gender)}
                        />
                      </Col>
                    </Row>

                    {/* CONTACT & SECURITY SECTION */}
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
                          label={t("Account Password")}
                          placeholder={t("Enter Password")}
                          containerClass={"mb-3"}
                        />
                      </Col>
                      <Col xl={6}>
                        <FormInput
                          name="Roles"
                          label={t("System Access Role")}
                          placeholder={t("Select Roles")}
                          containerClass={"mb-3"}
                          type="react-single-select"
                          options={[
                            { value: "STAFF", label: "STAFF" },
                            { value: "HOD", label: "HOD" },
                            { value: "ADMIN", label: "ADMIN" }, // Added ADMIN so admins can configure roles completely
                          ]}
                          defaultValue={[
                            { value: "STAFF", label: "STAFF" },
                            { value: "HOD", label: "HOD" },
                            { value: "ADMIN", label: "ADMIN" },
                          ].find((i) => i.value === EmployeeDetails?.Roles)}
                        />
                      </Col>
                    </Row>

                    {/* ADDITIONAL DETAILS LOG */}
                    <Row>
                      <Col xl={6}>
                        <FormInput
                          type="date"
                          name="DateOfBirth"
                          label={t("Date of Birth")}
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

                    {/* ACTIONS ROW */}
                    <Row className="mt-3">
                      <Col>
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Add Employee") : t("Update Profile")}
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
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeCreateUpdatePage;