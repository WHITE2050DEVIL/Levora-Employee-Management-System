// External Lib Import
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import { FormInput, VerticalForm } from "../../components/Ui";
import UserRequest from "../../APIRequest/UserRequest";
import defaultAvatar from "../../assets/images/users/avatar-1.jpg";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

const normalizeUser = (details) => {
  if (!details) return {};
  return Array.isArray(details) ? details[0] || {} : details;
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { UserDetails } = useSelector((state) => state.User);
  const { AccessToken } = useSelector((state) => state.Auth);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const currentUser = useMemo(() => normalizeUser(UserDetails), [UserDetails]);
  const [previewImg, setPreviewImg] = useState(currentUser?.Image || "");

  useEffect(() => {
    setPreviewImg(currentUser?.Image || "");
  }, [currentUser?.Image]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!AccessToken || currentUser?._id) return;
      setIsLoadingProfile(true);
      await UserRequest.ProfileDetails();
      setIsLoadingProfile(false);
    };

    loadProfile();
  }, [AccessToken, currentUser?._id]);

  const validationSchema = yup.object().shape({
    FirstName: yup
      .string()
      .trim()
      .required("Please enter first name")
      .min(2, "First name must be at least 2 characters"),
    LastName: yup
      .string()
      .trim()
      .required("Please enter last name")
      .min(1, "Last name is required"),
    Gender: yup.string().required("Please select gender"),
    Phone: yup
      .string()
      .required("Please enter phone")
      .min(8, "Phone number is too short"),
    Email: yup
      .string()
      .required("Please enter email")
      .email("Please enter a valid email"),
    DateOfBirth: yup
      .date()
      .typeError("Please select date of birth")
      .required("Please select date of birth")
      .max(new Date(), "Date of birth cannot be in the future"),
    Address: yup
      .string()
      .trim()
      .required("Please enter address")
      .min(8, "Address should be more descriptive"),
  });

  const fullName = [currentUser?.FirstName, currentUser?.LastName]
    .filter(Boolean)
    .join(" ");
  const role = currentUser?.Roles || "STAFF";
  const profileImage = removeAvatar
    ? defaultAvatar
    : previewImg || currentUser?.Image || defaultAvatar;

  const formDefaults = {
    FirstName: currentUser?.FirstName || "",
    LastName: currentUser?.LastName || "",
    Gender: currentUser?.Gender || "",
    Phone: currentUser?.Phone || "",
    Email: currentUser?.Email || "",
    DateOfBirth: currentUser?.DateOfBirth || "",
    Address: currentUser?.Address || "",
    Image: currentUser?.Image || "",
  };

  const handleProfileUpdate = async (values) => {
    if (isSaving) return;
    setIsSaving(true);

    const payload = {
      FirstName: values.FirstName?.trim(),
      LastName: values.LastName?.trim(),
      Gender: values.Gender,
      DateOfBirth: values.DateOfBirth,
      Address: values.Address?.trim(),
      Phone: values.Phone,
      Email: values.Email?.trim(),
      Image: removeAvatar ? "" : values.Image || currentUser?.Image || "",
    };

    const updated = await UserRequest.ProfileUpdate(payload);
    if (updated) {
      await UserRequest.ProfileDetails();
      setRemoveAvatar(false);
    }
    setIsSaving(false);
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Profile", path: "/dashboard" },
          {
            label: "Update Profile",
            path: "/dashboard",
            active: true,
          },
        ]}
        title="Profile Settings"
      />

      <Row className="g-3">
        <Col xl={4}>
          <Card className="hr-profile-card">
            <Card.Body>
              <div className="hr-profile-summary text-center">
                <img
                  src={profileImage}
                  alt="profile"
                  className="hr-profile-avatar"
                  onError={(event) => {
                    event.currentTarget.src = defaultAvatar;
                  }}
                />
                <h4 className="mb-1 mt-3">{fullName || "System User"}</h4>
                <Badge bg="primary-lighten" className="text-primary">
                  {role}
                </Badge>
                <p className="text-muted mt-2 mb-4">
                  {currentUser?.Email || "No email assigned"}
                </p>
              </div>

              <div className="hr-profile-stats">
                <div>
                  <span>Department</span>
                  <strong>{currentUser?.Department || "General"}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{currentUser?.Phone || "Not added"}</strong>
                </div>
                <div>
                  <span>Date Of Birth</span>
                  <strong>
                    {currentUser?.DateOfBirth
                      ? new Date(currentUser.DateOfBirth).toLocaleDateString()
                      : "Not added"}
                  </strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8}>
          <Card className="hr-profile-form-card">
            <Card.Body>
              <div className="hr-list-header">
                <div>
                  <h4>Profile Details</h4>
                  <p>Update your account information, contact details, and avatar.</p>
                </div>
              </div>

              {isLoadingProfile ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <VerticalForm
                  key={currentUser?._id || "profile-form"}
                  onSubmit={handleProfileUpdate}
                  validationSchema={validationSchema}
                  defaultValues={formDefaults}
                >
                  <Row>
                    <Col xl={6}>
                      <FormInput
                        name="Image"
                        label={t("Profile Avatar")}
                        type="file"
                        containerClass={"mb-3"}
                        onChange={(img) => {
                          setPreviewImg(img);
                          setRemoveAvatar(false);
                        }}
                      />
                    </Col>
                    <Col xl={6} className="d-flex align-items-end">
                      <Button
                        type="button"
                        variant="light"
                        className="mb-3"
                        onClick={() => {
                          setRemoveAvatar(true);
                          setPreviewImg("");
                        }}
                      >
                        Remove Avatar
                      </Button>
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
                        defaultValue={genderOptions.find(
                          (i) => i.value === currentUser?.Gender
                        )}
                      />
                    </Col>
                    <Col xl={6}>
                      <FormInput
                        type="react-phone"
                        name="Phone"
                        label={t("Phone")}
                        placeholder={t("Enter Phone")}
                        containerClass={"mb-3"}
                        defaultValue={currentUser?.Phone || ""}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xl={6}>
                      <FormInput
                        name="Email"
                        label={t("Email")}
                        placeholder={t("Enter Email")}
                        containerClass={"mb-3"}
                        type="email"
                      />
                    </Col>
                    <Col xl={6}>
                      <FormInput
                        type="date"
                        name="DateOfBirth"
                        label={t("Date Of Birth")}
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
                    <Col>
                      <FormInput
                        name="Address"
                        label={t("Address")}
                        placeholder={t("Enter Address")}
                        containerClass={"mb-3"}
                        type="textarea"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col className="d-flex gap-2">
                      <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Update Profile"}
                      </Button>
                      <Button
                        type="button"
                        variant="light"
                        onClick={async () => {
                          setIsLoadingProfile(true);
                          await UserRequest.ProfileDetails();
                          setIsLoadingProfile(false);
                          setRemoveAvatar(false);
                        }}
                      >
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                </VerticalForm>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
