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
import TagRequest from "../../APIRequest/TagRequest";
import AleartMessage from "../../helpers/AleartMessage";
import ExportDataJSON from "../../utils/ExportFromJSON";
import DateFormatter from "../../utils/DateFormatter";
import HtmlParser from "../../utils/HtmlParser";

const TagListPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchKey, setSearchKey] = useState("0"); // Normalized to standard string baseline

  // Pull tag data states directly from global Redux slice
  const { TagLists, TotalTag } = useSelector((state) => state.Tag);

  useEffect(() => {
    TagRequest.TagList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  // Safely calculate total pages to prevent NaN or division-by-zero crashes
  const totalPages = TotalTag > 0 ? Math.ceil(TotalTag / perPage) : 1;

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalTag > 0 ? TotalTag : 5);
    } else {
      setPerPage(parseInt(e.target.value, 10));
    }
    setPageNumber(1); // Reset back to first page upon changing display limits
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || "0";
    setSearchKey(key);
    setPageNumber(1); // Reset back to first page when filtering results
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

  const DeleteTag = (id) => {
    AleartMessage.Delete(id, TagRequest.TagDelete).then((result) => {
      if (result) {
        TagRequest.TagList(pageNumber, perPage, searchKey);
      }
    });
  };

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: "Tag", path: "/tag/tag-list" },
          {
            label: "Tag List",
            path: "/tag/tag-list",
            active: true,
          },
        ]}
        title={`Asset Tags (${TotalTag || 0} Records)`}
      />

      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              {/* UPPER ACTIONS ACTION LOG CONTROL BAR */}
              <Row className="mb-2">
                <Col sm={5}>
                  <Link to="/tag/tag-create-update" className="btn btn-danger mb-2">
                    <i className="mdi mdi-plus-circle me-2"></i> Add Tag
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
                      onClick={() => ExportDataJSON(TagLists || [], "Asset_Tags_Log", "xls")}
                    >
                      <SiMicrosoftexcel /> Export Excel
                    </Button>

                    <Button
                      variant="light"
                      className="mb-2"
                      onClick={() => ExportDataJSON(TagLists || [], "Asset_Tags_Log", "csv")}
                    >
                      <GrDocumentCsv /> Export CSV
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* SEARCH FILTER BOX LAYER */}
              <Row className="mb-3">
                <Col>
                  <div className="d-flex align-items-center">
                    <span className="d-flex align-items-center">
                      Search :
                      <input
                        placeholder={`${TotalTag || 0} records...`}
                        className="form-control w-auto ms-2"
                        onChange={SearchKeywordOnChange}
                      />
                    </span>
                  </div>
                </Col>
              </Row>

              {/* CENTRAL DATA SHEET */}
              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light" style={{ backgroundColor: "#eef2f7" }}>
                      <tr>
                        <th>Tag Name</th>
                        <th>Tag Details</th>
                        <th>Created On</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TagLists && TagLists.length > 0 ? (
                        TagLists.map((record, index) => (
                          // 👇 FIXED: Substituted native array index mappings for secure distinct object IDs
                          <tr key={record?._id || index}>
                            <td className="fw-semibold">{record?.TagName}</td>
                            <td>
                              {record?.TagDetails ? (
                                HtmlParser(record.TagDetails.slice(0, 100))
                              ) : (
                                "No details defined"
                              )}
                            </td>
                            <td>{DateFormatter(record?.createdAt)}</td>
                            <td>
                              <span
                                className={classNames("badge rounded-pill px-2 py-1", {
                                  "bg-success-lighten text-success": record?.TagStatus,
                                  "bg-danger-lighten text-danger": !record?.TagStatus,
                                })}
                              >
                                {record?.TagStatus ? "Active" : "Deactivated"}
                              </span>
                            </td>
                            <td>
                              {/* 👇 FIXED: Corrected URL parameter string case layout mismatch from /Tag/Tag to /tag/tag */}
                              <Link
                                to={`/tag/tag-create-update?id=${record?._id}`}
                                className="action-icon text-warning me-2"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteTag(record?._id)}
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            No asset tracking tags found matching your active filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>

              {/* DATA VIEW PAGINATION PANEL CONTROL BOARD */}
              <Row className="mt-3">
                <Col>
                  <div className="d-lg-flex align-items-center text-center pb-1">
                    <div className="d-inline-block me-3 mb-2 mb-lg-0">
                      <label className="me-1">Display :</label>
                      <select
                        className="form-select d-inline-block w-auto"
                        value={perPage === TotalTag ? "All" : perPage}
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
                        // 👇 FIXED: Changed manual numeric selector input to a fully controlled state binding element
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

export default TagListPage;