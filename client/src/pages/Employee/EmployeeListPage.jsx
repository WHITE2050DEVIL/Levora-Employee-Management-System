// External Lib Import
import React, { useEffect, useMemo, useState } from "react";
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
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState([]);

  const { EmployeeLists, TotalEmployee } = useSelector((state) => state.Employee);

  useEffect(() => {
    EmployeeRequest.EmployeeList(pageNumber, perPage, searchKey);
  }, [pageNumber, perPage, searchKey]);

  const filteredEmployees = useMemo(() => {
    return (EmployeeLists || []).filter((employee) => {
      const roleMatches =
        roleFilter === "ALL" || (employee?.Roles || "STAFF") === roleFilter;
      const departmentMatches =
        departmentFilter === "ALL" ||
        (employee?.Department || "Unassigned") === departmentFilter;

      return roleMatches && departmentMatches;
    });
  }, [EmployeeLists, roleFilter, departmentFilter]);

  const departmentOptions = useMemo(() => {
    const departments = (EmployeeLists || [])
      .map((employee) => employee?.Department || "Unassigned")
      .filter(Boolean);

    return ["ALL", ...Array.from(new Set(departments))];
  }, [EmployeeLists]);

  const selectedEmployees = useMemo(() => {
    return filteredEmployees.filter((employee) => selectedIds.includes(employee?._id));
  }, [filteredEmployees, selectedIds]);

  const totalPages = TotalEmployee > 0 ? Math.ceil(TotalEmployee / perPage) : 1;
  const visibleIds = filteredEmployees.map((employee) => employee?._id).filter(Boolean);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const PerPageOnChange = (e) => {
    if (e.target.value === "All") {
      setPerPage(TotalEmployee > 0 ? TotalEmployee : 5);
    } else {
      setPerPage(parseInt(e.target.value, 10));
    }
    setPageNumber(1);
    setSelectedIds([]);
  };

  const SearchKeywordOnChange = (e) => {
    const key = e.target.value || "0";
    setSearchKey(key);
    setPageNumber(1);
    setSelectedIds([]);
  };

  const HandlePageClick = (e) => {
    setPageNumber(e.selected + 1);
    setSelectedIds([]);
  };

  const GoToPage = (e) => {
    const pageNo = parseInt(e.target.value, 10);
    if (pageNo >= 1 && pageNo <= totalPages) {
      setPageNumber(pageNo);
      setSelectedIds([]);
    }
  };

  const ToggleAllVisible = (event) => {
    if (event.target.checked) {
      setSelectedIds((previousIds) =>
        Array.from(new Set([...previousIds, ...visibleIds]))
      );
      return;
    }

    setSelectedIds((previousIds) =>
      previousIds.filter((id) => !visibleIds.includes(id))
    );
  };

  const ToggleSelected = (id) => {
    if (!id) return;

    setSelectedIds((previousIds) =>
      previousIds.includes(id)
        ? previousIds.filter((selectedId) => selectedId !== id)
        : [...previousIds, id]
    );
  };

  const ClearFilters = () => {
    setRoleFilter("ALL");
    setDepartmentFilter("ALL");
    setSearchKey("0");
    setSelectedIds([]);
    setPageNumber(1);
  };

  const DeleteEmployee = (id) => {
    AleartMessage.Delete(id, EmployeeRequest.EmployeeDelete).then((result) => {
      if (result) {
        EmployeeRequest.EmployeeList(pageNumber, perPage, searchKey);
      }
    });
  };

  const exportRows = selectedEmployees.length ? selectedEmployees : filteredEmployees;

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
          <Card className="hr-list-card">
            <Card.Body>
              <div className="hr-list-header">
                <div>
                  <h4>People Operations</h4>
                  <p>
                    Manage employee accounts, roles, departments, exports, and quick selections.
                  </p>
                </div>
                <div className="hr-directory-actions">
                  {selectedIds.length > 0 && (
                    <span className="hr-selected-pill">
                      {selectedIds.length} selected
                    </span>
                  )}
                  <Link to="/employee/employee-create-update" className="btn btn-primary">
                    <i className="mdi mdi-plus-circle me-1"></i> Add Employee
                  </Link>
                  <Button
                    variant="light"
                    onClick={() => ExportDataJSON(exportRows, "Employee_Directory", "xls")}
                  >
                    <SiMicrosoftexcel className="me-1" /> Excel
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => ExportDataJSON(exportRows, "Employee_Directory", "csv")}
                  >
                    <GrDocumentCsv className="me-1" /> CSV
                  </Button>
                </div>
              </div>

              <div className="hr-filter-grid">
                <div className="hr-filter-field">
                  <label>Search</label>
                  <input
                    placeholder={`${TotalEmployee || 0} records...`}
                    className="form-control"
                    onChange={SearchKeywordOnChange}
                  />
                </div>
                <div className="hr-filter-field">
                  <label>Role</label>
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(event) => {
                      setRoleFilter(event.target.value);
                      setSelectedIds([]);
                    }}
                  >
                    <option value="ALL">All roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="HOD">Department Head</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
                <div className="hr-filter-field">
                  <label>Department</label>
                  <select
                    className="form-select"
                    value={departmentFilter}
                    onChange={(event) => {
                      setDepartmentFilter(event.target.value);
                      setSelectedIds([]);
                    }}
                  >
                    {departmentOptions.map((department) => (
                      <option value={department} key={department}>
                        {department === "ALL" ? "All departments" : department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hr-filter-field d-flex align-items-end">
                  <Button variant="light" className="w-100" onClick={ClearFilters}>
                    <i className="mdi mdi-filter-remove-outline me-1"></i>
                    Reset
                  </Button>
                </div>
              </div>

              <Row>
                <Col>
                  <Table className="table-centered react-table" responsive>
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "42px" }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={allVisibleSelected}
                            onChange={ToggleAllVisible}
                            aria-label="Select all visible employees"
                          />
                        </th>
                        <th>Employee</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>Department</th>
                        <th>System Role</th>
                        <th>Created On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees && filteredEmployees.length > 0 ? (
                        filteredEmployees.map((record, index) => (
                          <tr key={record?._id || index}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedIds.includes(record?._id)}
                                onChange={() => ToggleSelected(record?._id)}
                                aria-label={`Select ${record?.FirstName || "employee"}`}
                              />
                            </td>
                            <td>
                              <div className="d-flex px-2 py-1">
                                <div>
                                  <img
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
                            <td>{record?.Department || "Unassigned"}</td>
                            <td>
                              <span
                                className={classNames("badge px-2 py-1 rounded-pill", {
                                  "bg-danger-lighten text-danger": record?.Roles === "ADMIN",
                                  "bg-primary-lighten text-primary": record?.Roles === "HOD",
                                  "bg-success-lighten text-success":
                                    record?.Roles === "STAFF" || !record?.Roles,
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
                                aria-label="Edit employee"
                              >
                                <i className="mdi mdi-square-edit-outline" style={{ fontSize: "1.1rem" }}></i>
                              </Link>
                              <span
                                className="action-icon text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => DeleteEmployee(record?._id)}
                                role="button"
                                aria-label="Delete employee"
                              >
                                <i className="mdi mdi-delete" style={{ fontSize: "1.1rem" }}></i>
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8}>
                            <div className="hr-empty-state">
                              <i className="mdi mdi-account-search-outline"></i>
                              No employee accounts match your current directory criteria.
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
