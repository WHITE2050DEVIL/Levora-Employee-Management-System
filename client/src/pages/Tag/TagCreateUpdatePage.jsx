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
import TagRequest from "../../APIRequest/TagRequest";

const TagCreateUpdatePage = () => {
  const [objectID, setObjectID] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Connect to global Redux state for existing tag values
  const { TagDetails } = useSelector((state) => state.Tag);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setObjectID(id);
      TagRequest.TagDetails(id);
    }
  }, [searchParams]);

  /*
   * Form validation schema matrix
   */
  const validationSchema = yup.object().shape({
    TagName: yup.string().required(t("Please Enter Tag Name")),
    TagSlug: yup.string().required(t("Please Enter Tag Slug")),
  });

  /**
   * Handle the form submission wrapper
   */
  const CreateUpdateTag = (values) => {
    const payload = {
      TagName: values.TagName,
      TagSlug: values.TagSlug,
      TagDetails: values.TagDetails || "",
      TagStatus: !!values.TagStatus, // Ensures checkbox values parse into a strict Boolean mapping
    };

    if (!objectID) {
      TagRequest.TagCreate(payload).then((result) => {
        if (result) {
          navigate("/tag/tag-list");
        }
      });
    } else {
      TagRequest.TagUpdate(objectID, payload).then((result) => {
        if (result) {
          navigate("/tag/tag-list");
        }
      });
    }
  };

  // Explicit initialization states to shield inputs from uncontrolled state exceptions
  const formDefaults = objectID && TagDetails
    ? TagDetails
    : { TagName: "", TagSlug: "", TagDetails: "", TagStatus: true };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Tag", path: "/tag/tag-list" },
          {
            label: !objectID ? "Create Tag" : "Update Tag",
            path: "/tag/tag-list",
            active: true,
          },
        ]}
        title={!objectID ? t("Create Asset Tag") : t("Update Tag Details")}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  {/* 👇 FIXED: Appended an absolute rendering loop lifecycle key to 
                      guarantee the form fills with data immediately when Redux loads.
                  */}
                  <VerticalForm
                    key={objectID ? TagDetails?._id || "edit-mode" : "create-mode"}
                    onSubmit={CreateUpdateTag}
                    validationSchema={validationSchema}
                    defaultValues={formDefaults}
                  >
                    <Row>
                      <Col xs={12}>
                        <FormInput
                          name="TagName"
                          label={t("Tag Name")}
                          placeholder={t("Enter Tag Name")}
                          containerClass={"mb-3"}
                        />

                        <FormInput
                          name="TagSlug"
                          label={t("Tag Slug")}
                          placeholder={t("Enter Tag Slug")}
                          containerClass={"mb-3"}
                        />

                        <FormInput
                          name="TagDetails"
                          label={t("Tag Details")}
                          placeholder={t("Enter Tag Details")}
                          containerClass={"mb-3"}
                          type="simple-rich-edior" // Retained original internal template filename spelling string
                        />

                        <FormInput
                          name="TagStatus"
                          label={t("Active Status")}
                          containerClass={"mb-3"}
                          type="checkbox"
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col>
                        <Button type="submit" variant="success" className="me-2">
                          {!objectID ? t("Add Tag") : t("Update Tag")}
                        </Button>
                        <Button 
                          type="button" 
                          variant="light" 
                          onClick={() => navigate("/tag/tag-list")}
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

export default TagCreateUpdatePage;