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
import LeaveTypeRequest from "../../APIRequest/LeaveTypeRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";
import HtmlParser from "../../utils/HtmlParser";

const LeaveTypeListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState("0"); // Normalized to standard string baseline

  // Sync directly to the global Redux LeaveType data slice
  const { LeaveTypeLists, TotalLeaveType } = useSelector((state) => state.LeaveType);

  useEffect(() => {
    LeaveTypeRequest.LeaveTypeList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  // Safely calculate total pages to prevent NaN or divide-by-zero layout crashes
  const totalPages = TotalLeaveType > 0 ? Math.ceil(TotalLeaveType / perPage) : 1;

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalLeaveType > 0 ? TotalLeaveType : 5);
    } else {
      setPerPage(parseInt(e.target.value, 10));
    }
    // FIXED: Resets back to page 1 when modifying item count metrics
    setPageNumber(1); 
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || "0";
    setSearchKey(key);
    // FIXED: Resets back to page 1 when initiating a fresh search query
    setPageNumber(1);
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
  };

  const GoToPage = (e) => {
    const pageNo = parseInt(e.target.value, 10);
    // FIXED: Bound constraints check protects form parsing from jumping to illegal indexes
    if (pageNo >= 1 && pageNo <= totalPages) {
      setPageNumber(pageNo);
    }
  };

  const DeleteLeaveType = (id) => {
    AleartMessage.Delete(id, LeaveTypeRequest.LeaveTypeDelete).then((result) => {
      if (result) {
        LeaveTypeRequest.LeaveTypeList(pageNumber, perPage, searchKey);
      }
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Leave Type", path: "/leave-type/leave-type-list" },
          {
            label: "Leave Type List",
            path: "/leave-type/leave-type-list",
            active: true,
          },
        ]}
        title={`Leave Categories (${TotalLeaveType || 0} Built-in Types)`}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* TOP MASTER ACTION OPERATION CONTROLS BAR */}
              <Row className="mb-2">
                <Col sm={5}>
                  <Link to="/leave-type/leave-type-create-update" className="btn btn-danger mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Leave Type
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
                      onClick={() => ExportDataJSON(LeaveTypeLists || [], "Leave_Categories_Log", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(LeaveTypeLists || [], "Leave_Categories_Log", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* SEARCH FILTER FORM INPUT BLOCK */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center">
                      Search :
                      <input
                        placeholder={`${TotalLeaveType || 0} records...`}
                        className="form-control w-auto ms-2"
                        onChange={SearchKeywordOnChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>

              {/* CENTRAL RECORDS LAYOUT TABLE */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Leave Type Name</th>
                        <th>Leave Type Details</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LeaveTypeLists && LeaveTypeLists.length > 0 ? (
                        LeaveTypeLists.map((record, index) => (
                          // 👇 FIXED: Substituted array mapping loop indexes for explicit object IDs
                          <tr key={record?._id || index}>
                            <td className="fw-semibold">{record?.LeaveTypeName}</td>
                            <td>
                              {record?.LeaveTypeDetails ? (
                                HtmlParser(record.LeaveTypeDetails.slice(0, 100))
                              ) : (
                                "No descriptive notes added"
                              )}
                            </td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>
                              <span
                                className={classNames("badge rounded-pill px-2 py-1", {
                                  "bg-success-lighten text-success": record?.LeaveTypeStatus,
                                  "bg-danger-lighten text-danger": !record?.LeaveTypeStatus,
                                })}
                              >
                                {record?.LeaveTypeStatus ? "Active" : "Deactivated"}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/leave-type/leave-type-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteLeaveType(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            No system leave classifications found matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* FOOTER VIEWPORT PAGINATION STRIP CONTROLS */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display :</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === TotalLeaveType ? "All" : perPage}
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
                        // 👇 FIXED: Explicitly bound to state value to support next/prev updates
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
                      pageCount={totalPages} // 👇 FIXED: Used totalPages instead of math equations to dodge floats
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

export default LeaveTypeListPage;