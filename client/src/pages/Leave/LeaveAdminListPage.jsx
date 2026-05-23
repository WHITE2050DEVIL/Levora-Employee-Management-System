// External Import
import React, { useEffect, useMemo, useState } from "react";
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

const getCurrentUser = (userDetails) =>
  Array.isArray(userDetails) ? userDetails[0] : userDetails;

const LeaveAdminListPage = ({ status }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState(0);

  const { LeaveLists, TotalLeave } = useSelector((state) => state.Leave);
  const { UserDetails } = useSelector((state) => state.User);
  const userRole = getCurrentUser(UserDetails)?.Roles?.toUpperCase();

  const isAdmin = userRole === "ADMIN";
  const isHod = userRole === "HOD";
  const pageLabel = status ? `${status} Leave` : "Leave List";

  const fetchLeaves = async () => {
    if (!status) {
      if (isAdmin) {
        await LeaveRequest.LeaveAdminList(pageNumber, perPage, searchKey);
        return;
      }

      await LeaveRequest.LeaveList(pageNumber, perPage, searchKey);
      return;
    }

    if (isAdmin) {
      await LeaveRequest.LeaveListAdminByStatus(pageNumber, perPage, searchKey, {
        status,
      });
      return;
    }

    if (isHod) {
      await LeaveRequest.LeaveListHodByStatus(pageNumber, perPage, searchKey, {
        status,
      });
      return;
    }

    await LeaveRequest.LeaveList(pageNumber, perPage, searchKey);
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, perPage, searchKey, status, userRole]);

  const visibleLeaves = useMemo(() => {
    if (!status || isAdmin || isHod) return LeaveLists || [];

    return (LeaveLists || []).filter(
      (record) => record?.AdminStatus === status || record?.HodStatus === status
    );
  }, [LeaveLists, isAdmin, isHod, status]);

  const displayTotal = status && !isAdmin && !isHod ? visibleLeaves.length : TotalLeave || 0;
  const calculatedPageCount = Math.max(Math.ceil((displayTotal || 0) / perPage), 1);

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(displayTotal || 1);
    } else {
      setPerPage(Number(e.target.value));
    }
    setPageNumber(1);
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || 0;
    setSearchKey(key);
    setPageNumber(1);
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
  };

  const GoToPage = (e) => {
    const targetPage = Number(e.target.value);
    if (targetPage >= 1 && targetPage <= calculatedPageCount) {
      setPageNumber(targetPage);
    }
  };

  const DeleteLeave = (id) => {
    AleartMessage.Delete(id, LeaveRequest.LeaveDelete).then((result) => {
      if (result) fetchLeaves();
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Leave", path: "/leave/leave-list" },
          {
            label: pageLabel,
            path: "/leave/leave-list",
            active: true,
          },
        ]}
        title={`${pageLabel} (${displayTotal} Records)`}
      />

      <Row>
        <Col xs={12}>
          <Card className="hr-list-card">
            <Card.Body>
              <div className="hr-list-header">
                <div>
                  <h4>{pageLabel}</h4>
                  <p>
                    Review leave applications by employee, status, date, and approval flow.
                  </p>
                </div>
                <div className="hr-directory-actions">
                  <Button
                    variant="light"
                    onClick={() => ExportDataJSON(visibleLeaves, "Leave_Report", "xls")}
                  >
                    <SiMicrosoftexcel className="me-1" /> Excel
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => ExportDataJSON(visibleLeaves, "Leave_Report", "csv")}
                  >
                    <GrDocumentCsv className="me-1" /> CSV
                  </Button>
                </div>
              </div>

              <div className="hr-filter-grid">
                <div className="hr-filter-field">
                  <label>Search</label>
                  <input
                    placeholder={`${displayTotal} records...`}
                    className="form-control"
                    onChange={SearchKeywordOnChange}
                  />
                </div>
                <div className="hr-filter-field">
                  <label>Status View</label>
                  <input
                    className="form-control"
                    value={status || "All approved HOD leave"}
                    readOnly
                  />
                </div>
              </div>

              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light">
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
                      {visibleLeaves.length > 0 ? (
                        visibleLeaves.map((record, index) => (
                          <tr key={record?._id || index}>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <img
                                    src={record?.Employee?.[0]?.Image || "https://via.placeholder.com/150"}
                                    className="avatar avatar-sm me-3"
                                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                    alt="user"
                                  />
                                </div>
                                <div className="d-flex flex-column justify-content-center">
                                  <h6 className="mb-0 text-sm">
                                    {`${record?.Employee?.[0]?.FirstName || "Unknown"} ${record?.Employee?.[0]?.LastName || ""}`}
                                  </h6>
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
                                aria-label="Edit leave"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.2rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteLeave(record?._id)}
                                role="button"
                                aria-label="Delete leave"
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.2rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>
                            <div className="hr-empty-state">
                              <i className="mdi mdi-calendar-search"></i>
                              No leave applications found for this view.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display:</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === displayTotal ? "All" : perPage}
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
