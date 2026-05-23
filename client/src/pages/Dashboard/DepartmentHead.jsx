//External Lib Import
import { Badge, Card, Table } from "react-bootstrap";

const DepartmentHead = ({ departmentHeadsList }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title containerClass="d-flex align-items-center justify-content-between mb-2">
          Department Head
        </Card.Title>

        <Table hover responsive className="table-centered table-nowrap mb-0">
          <tbody>
            {departmentHeadsList?.length ? departmentHeadsList.map((i) => (
              <tr key={i?._id || i?.Email}>
                <td>
                  <div className="d-flex align-items-start">
                    <img
                      className="me-2 rounded-circle"
                      src={i?.Image || "https://via.placeholder.com/150"}
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                      alt="department head"
                    />
                    <div>
                      <h5 className="mt-0 mb-1">
                        {i?.FirstName + " " + i?.LastName}{" "}
                        <Badge>{i?.Department}</Badge>
                      </h5>
                      <span className="font-13">{i?.Email}</span>
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="text-muted py-4 text-center">
                  No department heads are available yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default DepartmentHead;
