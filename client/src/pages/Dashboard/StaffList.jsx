// @flow
import React from "react";
import { Badge, Card, Table } from "react-bootstrap";

const StaffList = ({ staffList = [] }) => {
  
  // Safe default fallback list to keep the layout clean if data is fetching
  const defaultStaffFallback = [
    { _id: "1", FirstName: "System", LastName: "User", Department: "Operations", Address: "System Address", Email: "user@company.com", Image: "https://via.placeholder.com/150" }
  ];

  const activeStaffList = staffList && staffList.length > 0 ? staffList : defaultStaffFallback;
  const resolveEmployeeName = (employee) =>
    [employee?.FirstName, employee?.LastName].filter(Boolean).join(" ") || "Unnamed Employee";

  return (
    <Card className="card-h-100">
      <Card.Body>
        {/* FIXED: Changed containerClass to className to match react-bootstrap API standard */}
        <Card.Title className="d-flex align-items-center justify-content-between mb-3 header-title">
          Staff Directory
        </Card.Title>

        <Table hover responsive className="table-centered table-nowrap mb-0">
          <tbody>
            {activeStaffList.map((employee, index) => (
              // 👇 FIXED: Added unique key tracking to prevent React DOM matching loops warnings
              <tr key={employee?._id || index}>
                <td>
                  <div className="d-flex align-items-start">
                    <img
                      className="me-3 rounded-circle avatar-sm"
                      src={employee?.Image || "https://via.placeholder.com/150"} // 👇 FIXED: Added broken/missing image guard fallback
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                      alt="staff profile"
                    />
                    <div className="w-100">
                      <h5 className="mt-0 mb-1 font-14 fw-semibold">
                        {resolveEmployeeName(employee)}{" "}
                        <Badge bg="primary-lighten" className="text-primary ms-1 font-11 px-2 py-1 rounded-pill">
                          {employee?.Department || "General"}
                        </Badge>
                      </h5>
                      <span className="text-muted font-13">{employee?.Email || "No email assigned"}</span>
                      <div className="text-muted font-12 mt-1 text-truncate">
                        {employee?.Address || "No address on file"}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default StaffList;
