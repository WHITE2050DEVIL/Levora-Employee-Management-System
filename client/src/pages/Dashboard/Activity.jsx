// @flow
import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-bootstrap"; // Standardized routing link or bootstrap link wrapper
import { useSelector } from "react-redux";
import SimpleBar from "simplebar-react";

// components
import Timeline from "../../components/Ui/Timeline";
import TimelineItem from "../../components/Ui/TimelineItem";
import CardTitle from "../../components/Ui/CardTitle";

const Activity = () => {
  // 1. Pull real, dynamic data from Redux instead of hardcoded sales strings
  const { SummaryLists } = useSelector((state) => state.Summary || {});

  return (
    <Card>
      <Card.Body className="pb-0">
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between mb-2"
          title="Recent System Updates"
          menuItems={[
            { label: "Refresh Feed" }
          ]}
        />
      </Card.Body>
      <SimpleBar style={{ maxHeight: "412px", width: "100%" }}>
        <Card.Body className="py-0">
          <Timeline>
            {SummaryLists && SummaryLists.length > 0 ? (
              SummaryLists.map((item, index) => (
                <TimelineItem key={item._id || index}>
                  {/* Dynamic Icons based on activity type */}
                  <i className={`mdi ${
                    item.Status === "Approved" ? "mdi-check-circle bg-success-lighten text-success" : 
                    item.Status === "Rejected" ? "mdi-close-circle bg-danger-lighten text-danger" : 
                    "mdi-clock-outline bg-warning-lighten text-warning"
                  } timeline-icon`}></i>
                  
                  <div className="timeline-item-info">
                    <span className="fw-bold mb-1 d-block text-dark">
                      {item.Title || "Leave Application Update"}
                    </span>
                    <small className="text-muted d-block">
                      {item.Description || `Request processed with status: ${item.Status}`}
                    </small>
                    <p className="mb-0 pb-2">
                      <small className="text-muted">
                        {item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : "Just now"}
                      </small>
                    </p>
                  </div>
                </TimelineItem>
              ))
            ) : (
              /* Fallback UI if there are no system notifications */
              <div className="text-center py-4 text-muted">
                <i className="mdi mdi-alert-circle-outline d-block font-20 mb-1"></i>
                <small>No recent activity logs available.</small>
              </div>
            )}
          </Timeline>
        </Card.Body>
      </SimpleBar>
    </Card>
  );
};

export default Activity;