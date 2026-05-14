// External Import
import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { GrDocumentCsv } from "react-icons/gr";
import { SiMicrosoftexcel } from "react-icons/si";
import { useSelector } from "react-redux";
import classNames from "classnames";

// Internal Lib Import
import PageTitle from "../../components/Ui/PageTitle";
import LeaveRequest from "../../APIRequest/LeaveRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";

const LeaveAdminListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState(0);

  // Direct state sync tracking from global Redux leave slice
  const { LeaveLists, TotalLeave } = useSelector((state) => state.Leave);

  useEffect(() => {
    LeaveRequest.LeaveAdminList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalLeave || 1);
    } else {
      setPerPage(Number(e.target.value));
    }
    setPageNumber(1); // Reset to page 1 on display count change
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || 0;
    setSearchKey(key);
    setPageNumber(1); // Reset to page 1 when searching
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
  };

  const GoToPage = (e) => {
    const targetPage = Number(e.target.value);
    const maxPage = Math.ceil((TotalLeave || 0) / perPage) || 1;
    if (targetPage >= 1 && targetPage <= maxPage) {
      setPageNumber(targetPage);
    }
  };

  const DeleteLeave = (id) => {
    AleartMessage.Delete(id, LeaveRequest.LeaveDelete).then((result) => {
      if (result) {
        LeaveRequest.LeaveAdminList(pageNumber, perPage, searchKey);
      }
    });
  };

  // Safe Math calculation to protect ReactPaginate from floating decimals or NaN
  const calculatedPageCount = Math.ceil((TotalLeave || 0) / perPage) || 1;

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Leave", path: "/leave/leave-list" },
          {
            label: "Admin List",
            path: "/leave/leave-list",
            active: true,
          },
        ]}
        title={`Leave Administration (${TotalLeave || 0} Records)`}
      />
      
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* TOP ACTION BAR */}
              <Row className="mb-2">
                <Col sm={5}></Col>
                <Col sm={7}>
                  <div className="text-sm-end">
                    <Button variant="success" className="mb-2 me-1">
                      <i className="mdi mdi-cog-outline"></i>
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2 me-1"
                      onClick={() => ExportDataJSON(LeaveLists || [], "Leave_Report", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(LeaveLists || [], "Leave_Report", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* FILTER / SEARCH INPUT */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <label className="mb-0 me-2">Search:</label>
                    <input
                      placeholder={`${TotalLeave || 0} records...`}
                      className="form-control w-auto"
                      onChange={SearchKeywordOnChange}
                    />
                  </div>
                </Col>
              </Row>

              {/* DATA RENDER GRID */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Application Date</th>
                        <th>Total Days</th>
                        <th>HOD Status</th>
                        <th>Admin Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LeaveLists && LeaveLists.length > 0 ? (
                        LeaveLists.map((record, index) => (
                          <tr key={record?._id || index}>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <img
                                    src={record?.Employee?.[0]?.Image || "https://via.placeholder.com/150"}
                                    className="avatar avatar-sm me-3"
                                    style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                    alt="user"
                                  />
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm">
                                    {`${record?.Employee?.[0]?.FirstName || "Unknown"} ${record?.Employee?.[0]?.LastName || ""}`}
                                  </h6>
                                  {/* FIXED: Removed internal nested <td> wrapper to clean up rendering tree output */}
                                  <span className="text-xs text-secondary">
                                    {record?.Employee?.[0]?.Email || "No Email Linked"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>{record?.LeaveType}</td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>{record?.NumOfDay || 0}</td>
                            <td>
                              <span
                                className={classNames("badge", {
                                  "bg-success": record?.HodStatus === "Approved",
                                  "bg-warning": record?.HodStatus === "Pending" || !record?.HodStatus,
                                  "bg-danger": record?.HodStatus === "Rejected",
                                })}
                              >
                                {record?.HodStatus || "Pending"}
                              </span>
                            </td>
                            <td>
                              <span
                                className={classNames("badge", {
                                  "bg-success": record?.AdminStatus === "Approved",
                                  "bg-warning": record?.AdminStatus === "Pending" || !record?.AdminStatus,
                                  "bg-danger": record?.AdminStatus === "Rejected",
                                })}
                              >
                                {record?.AdminStatus || "Pending"}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/leave/leave-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.2rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteLeave(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.2rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            No leave applications found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* PAGINATION PANEL FOOTER */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display:</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage}
                        onChange={PerPageOnChange}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value="All">All</option>
                      </select>
                    </div>
                    
                    <span className="me-3 d-inline-block mb-2 mb-lg-0">
                      Page <strong>{pageNumber} of {calculatedPageCount}</strong>
                    </span>

                    <div className="d-inline-block align-items-center mb-2 mb-lg-0">
                      <label>Go to page:</label>
                      <input
                        type="number"
                        min={1}
                        max={calculatedPageCount}
                        className="form-control w-25 ms-1 d-inline-block"
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
                      pageCount={calculatedPageCount}
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

export default LeaveAdminListPage;