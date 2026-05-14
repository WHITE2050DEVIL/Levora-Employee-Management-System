// External Lib Import
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { GrDocumentCsv } from "react-icons/gr";
import { SiMicrosoftexcel } from "react-icons/si";
import classNames from "classnames";
import { useSelector } from "react-redux";

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import EmployeeRequest from "../../APIRequest/EmployeeRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";

const EmployeeListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState("0");

  // Hook into the global Redux employee data slice
  const { EmployeeLists, TotalEmployee } = useSelector((state) => state.Employee);

  useEffect(() => {
    EmployeeRequest.EmployeeList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  // Safely calculate total pages to prevent NaN or divide-by-zero crashes
  const totalPages = TotalEmployee > 0 ? Math.ceil(TotalEmployee / perPage) : 1;

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalEmployee > 0 ? TotalEmployee : 5);
    } else {
      setPerPage(parseInt(e.target.value, 10));
    }
    setPageNumber(1);
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || "0";
    setSearchKey(key);
    setPageNumber(1);
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
  };

  const GoToPage = (e) => {
    const pageNo = parseInt(e.target.value, 10);
    if (pageNo >= 1 && pageNo <= totalPages) {
      setPageNumber(pageNo);
    }
  };

  const DeleteEmployee = (id) => {
    AleartMessage.Delete(id, EmployeeRequest.EmployeeDelete).then((result) => {
      if (result) {
        EmployeeRequest.EmployeeList(pageNumber, perPage, searchKey);
      }
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Employee", path: "/employee/employee-list" },
          {
            label: "Employee List",
            path: "/employee/employee-list",
            active: true,
          },
        ]}
        title={`Staff Directory (${TotalEmployee || 0} Accounts)`}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* MANAGEMENT OPERATIONS BAR */}
              <Row className="mb-2">
                <Col sm={5}>
                  <Link to="/employee/employee-create-update" className="btn btn-danger mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Employee
                  </Link>
                </Col>

                <Col sm={7}>
                  <div className="text-sm-end">
                    <Button variant="success" className="mb-2 me-1">
                      <i className="mdi mdi-cog-outline"></i>
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2 me-1"
                      onClick={() => ExportDataJSON(EmployeeLists || [], "Employee_Directory", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(EmployeeLists || [], "Employee_Directory", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* LIVE RECORDFILTER BAR */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center">
                      Search :
                      <input
                        placeholder={`${TotalEmployee || 0} records...`}
                        className="form-control w-auto ms-2"
                        onChange={SearchKeywordOnChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>

              {/* DATA TABLE MATRIX */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Employee</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>System Role</th>
                        <th>Created On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EmployeeLists && EmployeeLists.length > 0 ? (
                        EmployeeLists.map((record, index) => (
                          // 👇 FIXED: Swapped index keys with absolute item IDs to secure row updates
                          <tr key={record?._id || index}>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <img
                                    // 👇 FIXED: Added an explicit default avatar guard if no profile image exists
                                    src={record?.Image || "https://via.placeholder.com/150"}
                                    className="avatar avatar-sm me-3 rounded-circle img-thumbnail"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    alt="employee avatar"
                                  />
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm fw-semibold">
                                    {`${record?.FirstName || ""} ${record?.LastName || ""}`}
                                  </h6>
                                  <span className="text-xs text-secondary">
                                    {record?.Email || "No Email Bound"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>{record?.Phone || "NA"}</td>
                            <td className="text-truncate" style={{ maxWidth: "200px" }}>
                              {record?.Address || "NA"}
                            </td>
                            <td>
                              <span
                                className={classNames("badge px-2 py-1 rounded-pill", {
                                  "bg-danger-lighten text-danger": record?.Roles === "ADMIN",
                                  "bg-primary-lighten text-primary": record?.Roles === "HOD",
                                  "bg-success-lighten text-success": record?.Roles === "STAFF" || !record?.Roles,
                                })}
                              >
                                {record?.Roles || "STAFF"}
                              </span>
                            </td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>
                              <Link
                                to={`/employee/employee-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteEmployee(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4 text-muted">
                            No employee accounts match your current directory criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* DATA PAGINATION VIEW CONTROL PANEL */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display :</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === TotalEmployee ? "All" : perPage}
                        onChange={PerPageOnChange}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value="All">All</option>
                      </select>
                    </div>

                    <span className="me-3 d-inline-block mb-2 mb-lg-0">
                      Page <strong>{pageNumber} of {totalPages}</strong>
                    </span>

                    <div className="d-inline-block align-items-center mb-2 mb-lg-0">
                      <label>Go to page : </label>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        className="form-control w-25 ms-1 d-inline-block"
                        // 👇 FIXED: Changed from uncontrolled defaultValue to controlled input
                        value={pageNumber}
                        onChange={GoToPage}
                      />
                    </div>

                    <ReactPaginate
                      previousLabel="<"
                      nextLabel=">"
                      pageClassName="page-item d-none d-xl-inline-block"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      containerClassName="pagination pagination-rounded d-inline-flex ms-auto align-items-center mb-0 mt-2 mt-lg-0"
                      activeClassName="active"
                      onPageChange={HandlePageClick}
                      forcePage={pageNumber - 1}
                    />
                  </div>
                </Col>
              </Row>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeListPage;