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
import DepartmentRequest from "../../APIRequest/DepartmentRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";
import HtmlParser from "../../utils/HtmlParser";

const DepartmentListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState("0");

  // Connect to global Redux state
  const { DepartmentLists, TotalDepartment } = useSelector((state) => state.Department);

  useEffect(() => {
    DepartmentRequest.DepartmentList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  // Safely calculate total pages to prevent NaN or division-by-zero crashes
  const totalPages = TotalDepartment > 0 ? Math.ceil(TotalDepartment / perPage) : 1;

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalDepartment > 0 ? TotalDepartment : 5);
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

  const DeleteDepartment = (id) => {
    AleartMessage.Delete(id, DepartmentRequest.DepartmentDelete).then((result) => {
      if (result) {
        DepartmentRequest.DepartmentList(pageNumber, perPage, searchKey);
      }
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Department", path: "/department/department-list" },
          {
            label: "Department List",
            path: "/department/department-list",
            active: true,
          },
        ]}
        title={`Department Directories (${TotalDepartment || 0})`}
      />
      
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* UPPER ACTION CONTROL ROW */}
              <Row className="mb-2">
                <Col sm={5}>
                  <Link to="/department/department-create-update" className="btn btn-danger mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Department
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
                      onClick={() => ExportDataJSON(DepartmentLists || [], "Department_Report", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(DepartmentLists || [], "Department_Report", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* SEARCH FILTER BOX */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center">
                      Search :
                      <input
                        placeholder={`${TotalDepartment || 0} records...`}
                        className="form-control w-auto ms-2"
                        onChange={SearchKeywordOnChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>

              {/* DATA GRAPH SHEET */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Department Name</th>
                        <th>Department Details</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DepartmentLists && DepartmentLists.length > 0 ? (
                        DepartmentLists.map((record, index) => (
                          // 👇 FIXED: Swapped out unreliable array indexes for distinct object IDs
                          <tr key={record?._id || index}>
                            <td className="fw-semibold">{record?.DepartmentName}</td>
                            <td>
                              {record?.DepartmentDetails 
                                ? HtmlParser(record.DepartmentDetails.slice(0, 100)) 
                                : "No description provided"}
                            </td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>
                              <span
                                className={classNames("badge rounded-pill px-2 py-1", {
                                  "bg-success-lighten text-success": record?.DepartmentStatus,
                                  "bg-danger-lighten text-danger": !record?.DepartmentStatus,
                                })}
                              >
                                {record?.DepartmentStatus ? "Active" : "Deactivated"}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/department/department-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteDepartment(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            No departments found matching your active criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* PAGINATION PANEL CONTROLS */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display :</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === TotalDepartment ? "All" : perPage}
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
                        // 👇 FIXED: Bound explicitly to pageNumber state to update field automatically
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

export default DepartmentListPage;