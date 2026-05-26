// @flow
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Products = ({ productsData = [], title = "Top Selling Products" }) => {

  // Clean fallback data so the dashboard stays populated if the database load is delayed
  const defaultProducts = [
    { id: 1, name: "ASOS Ridley High Waist", date: "07 May 2026", price: "₹5,499", quantity: "82 Units", amount: "Allocation" },
    { id: 2, name: "Marco Lightweight Shirt", date: "25 April 2026", price: "₹2,850", quantity: "37 Units", amount: "Maintenance" },
    { id: 3, name: "Half Sleeve Shirt", date: "17 April 2026", price: "₹1,999", quantity: "64 Units", amount: "In Stock" },
    { id: 4, name: "Lightweight Jacket", date: "12 April 2026", price: "₹8,500", quantity: "184 Units", amount: "Allocation" },
    { id: 5, name: "Marco Shoes", date: "05 April 2026", price: "₹4,249", quantity: "69 Units", amount: "In Stock" }
  ];

  // Resolve active loop targets cleanly
  const renderList = productsData.length > 0 ? productsData : defaultProducts;

  return (
    <Card className="card-h-100">
      <Card.Body>
        <Link to="#" className="float-end text-muted font-13">
          Export <i className="mdi mdi-download ms-1"></i>
        </Link>

        <h4 className="header-title mt-2 mb-3">{title}</h4>

        <Table hover responsive className="mb-0 table-centered">
          <tbody>
            {renderList.map((item, index) => (
              // 👇 FIXED: Added unique React mapping key to safeguard reconciliation loops
              <tr key={item.id || index}>
                <td>
                  <h5 className="font-14 my-1 fw-normal">{item.name}</h5>
                  <span className="text-muted font-13">{item.date}</span>
                </td>
                <td>
                  <h5 className="font-14 my-1 fw-normal">{item.price}</h5>
                  <span className="text-muted font-13">Cost / Value</span>
                </td>
                <td>
                  <h5 className="font-14 my-1 fw-normal">{item.quantity}</h5>
                  <span className="text-muted font-13">Quantity</span>
                </td>
                <td>
                  <h5 className="font-14 my-1 fw-normal">{item.amount}</h5>
                  <span className="text-muted font-13">Status</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Products;