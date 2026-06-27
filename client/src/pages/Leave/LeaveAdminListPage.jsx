// External Import
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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

const getLeaveEmployee = (record) => record?.Employee?.[0] || record?.Employee || {};

const LeaveAdminListPage = ({ status }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState(0);
  const [statusDrafts, setStatusDrafts] = useState({});
  const navigate = useNavigate();

  const { LeaveLists, TotalLeave } = useSelector((state) => state.Leave);
  const { UserDetails } = useSelector((state) => state.User);
  const userRole = getCurrentUser(UserDetails)?.Roles?.toUpperCase();

  const isAdmin = userRole === "ADMIN";
  const isHod = userRole === "HOD";
  const pageLabel = status ? `${status} Leave` : "Leave List";
  const statusViewValue = status || "__default";
  const editableStatusField = isHod ? "HodStatus" : isAdmin ? "AdminStatus" : null;
  const editableRemarkField = isHod ? "HodRemark" : isAdmin ? "AdminRemark" : null;
  const statusViewOptions = [
    { value: "__default", label: "HOD approved leave", path: "/leave/leave-list" },
    { value: "All", label: "All leave", path: "/leave/leave-list-all" },
    { value: "Pending", label: "Pending leave", path: "/leave/leave-list-pending" },
    { value: "Approved", label: "Approved leave", path: "/leave/leave-list-approved" },
    { value: "Rejected", label: "Rejected leave", path: "/leave/leave-list-rejected" },
  ];

  const fetchLeaves = async () => {
    if (status === "All") {
      await LeaveRequest.LeaveList(pageNumber, perPage, searchKey);
      return;
    }

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

  useEffect(() => {
    if (!editableStatusField) return;

    setStatusDrafts((prev) => {
      const next = { ...prev };
      (LeaveLists || []).forEach((record) => {
        next[record?._id] = record?.[editableStatusField] || "Pending";
      });
      return next;
    });
  }, [LeaveLists, editableStatusField]);

  const visibleLeaves = useMemo(() => {
    if (!status || status === "All" || isAdmin || isHod) return LeaveLists || [];

    return (LeaveLists || []).filter(
      (record) => record?.AdminStatus === status || record?.HodStatus === status,
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

  const handleStatusViewChange = (e) => {
    const nextView = statusViewOptions.find((option) => option.value === e.target.value);
    if (nextView?.path) {
      navigate(nextView.path);
      setPageNumber(1);
      setSearchKey(0);
    }
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

  const handleHodDecision = async (id, decision) => {
    const payload = {
      HodStatus: decision,
      HodRemark: `Updated by HOD from ${pageLabel}`,
    };

    const result = await LeaveRequest.LeaveUpdate(id, payload);
    if (result) {
      fetchLeaves();
    }
  };

  const handleInlineStatusChange = (id, value) => {
    setStatusDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleInlineStatusSave = async (record) => {
    if (!editableStatusField || !record?._id) return;

    const nextStatus = statusDrafts?.[record._id] || record?.[editableStatusField] || "Pending";
    const payload = {
      [editableStatusField]: nextStatus,
      [editableRemarkField]: `Updated from leave list as ${nextStatus}`,
    };

    const result = await LeaveRequest.LeaveUpdate(record._id, payload);
    if (result) {
      fetchLeaves();
    }
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
                  <p>Review leave applications by employee, status, date, and approval flow.</p>
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
                  <Form.Select
                    className="form-control"
                    value={statusViewValue}
                    onChange={handleStatusViewChange}
                  >
                    {statusViewOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              {editableStatusField ? (
                <div className="alert alert-info py-2 px-3 mt-3 mb-3">
                  Change the status directly from the Action column using the dropdown and Save button.
                </div>
              ) : null}

              <Row>
                <Col>
                  <Table
                    className="table-centered react-table mb-0"
                    style={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "28%" }}>Employee</th>
                        <th style={{ width: "14%" }}>Leave Type</th>
                        <th style={{ width: "14%" }}>Applied</th>
                        <th style={{ width: "8%" }}>Days</th>
                        <th style={{ width: "12%" }}>HOD</th>
                        <th style={{ width: "12%" }}>Admin</th>
                        <th style={{ width: "12%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleLeaves.length > 0 ? (
                        visibleLeaves.map((record, index) => {
                          const employee = getLeaveEmployee(record);

                          return (
                            <tr key={record?._id || index}>
                              <td>
                                <div className="d-flex px-2 py-1">
                                  <div>
                                    <img
                                      src={employee?.Image || "https://via.placeholder.com/150"}
                                      className="avatar avatar-sm me-2"
                                      style={{
                                        width: "38px",
                                        height: "38px",
                                        minWidth: "38px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "1px solid #d8e0ea",
                                      }}
                                      alt="employee avatar"
                                    />
                                  </div>
                                  <div className="d-flex flex-column justify-content-center text-truncate">
                                    <h6 className="mb-0 text-sm text-truncate">
                                      {`${employee?.FirstName || "Unknown"} ${employee?.LastName || ""}`}
                                    </h6>
                                    <span className="text-xs text-secondary text-truncate">
                                      {employee?.Email || "No Email Linked"}
                                    </span>
                                    <span className="text-xs text-muted text-truncate">
                                      {employee?.Department || "Unassigned"} |{" "}
                                      {employee?.Address || "No address on file"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="text-truncate">{record?.LeaveType}</td>
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
                                {editableStatusField ? (
                                  <div className="d-flex flex-column gap-2">
                                    <Form.Select
                                      size="sm"
                                      value={
                                        statusDrafts?.[record?._id] ||
                                        record?.[editableStatusField] ||
                                        "Pending"
                                      }
                                      onChange={(e) =>
                                        handleInlineStatusChange(record?._id, e.target.value)
                                      }
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </Form.Select>
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() => handleInlineStatusSave(record)}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                ) : isHod && record?.HodStatus === "Pending" ? (
                                  <div className="d-flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="success"
                                      className="px-2 py-1"
                                      onClick={() => handleHodDecision(record?._id, "Approved")}
                                    >
                                      Ok
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      className="px-2 py-1"
                                      onClick={() => handleHodDecision(record?._id, "Rejected")}
                                    >
                                      No
                                    </Button>
                                  </div>
                                ) : (
                                  <Link to={`/leave/leave-create-update?id=${record?._id}`}>
                                    <Button size="sm" variant="outline-primary" className="me-2">
                                      Review
                                    </Button>
                                  </Link>
                                )}
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
                          );
                        })
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
