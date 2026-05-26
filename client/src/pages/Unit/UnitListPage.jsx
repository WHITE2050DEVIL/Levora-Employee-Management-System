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
import UnitRequest from "../../APIRequest/UnitRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";
import HtmlParser from "../../utils/HtmlParser";

const UnitListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState("0"); // Normalized to a clean string format

  // Sync to the global Redux unit state slice
  const { UnitLists, TotalUnit } = useSelector((state) => state.Unit);

  useEffect(() => {
    UnitRequest.UnitList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  // FIXED: Safely calculate total pages to prevent NaN or division-by-zero crashes
  const totalPages = TotalUnit > 0 ? Math.ceil(TotalUnit / perPage) : 1;

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalUnit > 0 ? TotalUnit : 5);
    } else {
      setPerPage(parseInt(e.target.value, 10));
    }
    // FIXED: Always reset to page 1 when changing display limits
    setPageNumber(1); 
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || "0";
    setSearchKey(key);
    // FIXED: Always reset to page 1 when running a brand new query search
    setPageNumber(1);
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
  };

  const GoToPage = (e) => {
    const pageNo = parseInt(e.target.value, 10);
    // FIXED: Enforced bounded constraint checks to protect manual index entry fields
    if (pageNo >= 1 && pageNo <= totalPages) {
      setPageNumber(pageNo);
    }
  };

  const DeleteUnit = (id) => {
    AleartMessage.Delete(id, UnitRequest.UnitDelete).then((result) => {
      if (result) {
        UnitRequest.UnitList(pageNumber, perPage, searchKey);
      }
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Unit", path: "/unit/unit-list" },
          {
            label: "Unit List",
            path: "/unit/unit-list",
            active: true,
          },
        ]}
        title={`Unit Quantities (${TotalUnit || 0})`}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* TOP ACTION CONTROL PANEL ROW */}
              <Row className="mb-2">
                <Col sm={5}>
                  <Link to="/unit/unit-create-update" className="btn btn-danger mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Unit
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
                      onClick={() => ExportDataJSON(UnitLists || [], "Unit_Inventory_Log", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(UnitLists || [], "Unit_Inventory_Log", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* SEARCH FILTER MATRIX ROW */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center">
                      Search :
                      <input
                        placeholder={`${TotalUnit || 0} records...`}
                        className="form-control w-auto ms-2"
                        onChange={SearchKeywordOnChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>

              {/* CENTRAL DATA SHEET LOG */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Unit Name</th>
                        <th>Unit Details</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UnitLists && UnitLists.length > 0 ? (
                        UnitLists.map((record, index) => (
                          // 👇 FIXED: Substituted unstable array indexes for secure unique database object IDs
                          <tr key={record?._id || index}>
                            <td className="fw-semibold">{record?.UnitName}</td>
                            <td>
                              {record?.UnitDetails ? (
                                HtmlParser(record.UnitDetails.slice(0, 100))
                              ) : (
                                "No details defined"
                              )}
                            </td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>
                              <span
                                className={classNames("badge rounded-pill px-2 py-1", {
                                  "bg-success-lighten text-success": record?.UnitStatus,
                                  "bg-danger-lighten text-danger": !record?.UnitStatus,
                                })}
                              >
                                {record?.UnitStatus ? "Active" : "Deactivated"}
                              </span>
                            </td>
                            <td>
                              <Link
                                to={`/unit/unit-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteUnit(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            No unit definitions found matching your current dashboard index.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* PAGINATION OPERATIONS CONTROL BAR */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display :</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === TotalUnit ? "All" : perPage}
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
                        // 👇 FIXED: Converted to a fully controlled input using value state binding
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

export default UnitListPage;