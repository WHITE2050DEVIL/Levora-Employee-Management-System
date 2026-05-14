// @flow
import classNames from "classnames";
import React from "react";
import Chart from "react-apexcharts";
import { Card } from "react-bootstrap";

const LeaveChart = ({ summaryLists }) => {
  
  // Dynamically extract data labels (e.g., ["Approved", "Pending", "Rejected"])
  const chartLabels = summaryLists?.map((i) => i._id) || [];
  
  // Dynamically extract numerical data counts
  const chartSeries = summaryLists?.map((i) => i.count) || [];

  const apexDonutOpts = {
    chart: {
      height: 340,
      type: "donut",
    },
    // 👇 FIXED: Added dynamic labels mapping so hover tooltips show status names
    labels: chartLabels, 
    colors: ["#0acf97", "#fa5c7c", "#ffbc00"], // Success (Green), Danger (Red), Warning (Yellow)
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 376,
        options: {
          chart: {
            width: 250,
            height: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Card className="border-0 m-0"> {/* 👇 Stripped card border to prevent double-boxing */}
      <Card.Body className="p-0">
        {chartSeries.length > 0 ? (
          <Chart
            options={apexDonutOpts}
            series={chartSeries}
            type="donut"
            height={222}
            className="apex-charts mb-4 mt-4"
          />
        ) : (
          <div className="text-center py-4 text-muted">No data available for chart</div>
        )}

        <div className="chart-widget-list">
          {summaryLists?.map((summary, index) => (
            // 👇 FIXED: Added a unique React key to eliminate console loop warnings
            <p key={summary?._id || index} className="mb-2">
              <i
                className={classNames("mdi mdi-square me-2", {
                  "text-warning": summary?._id === "Pending",
                  "text-danger": summary?._id === "Rejected",
                  "text-success": summary?._id === "Approved",
                })}
              ></i>
              {summary?._id || "Unknown"}
              <span className="float-end fw-bold">{summary?.count || 0}</span>
            </p>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LeaveChart;