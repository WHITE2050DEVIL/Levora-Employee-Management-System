// @flow
import React from "react";
import { Card, ProgressBar } from "react-bootstrap";

// component
import CardTitle from "../../components/Ui/CardTitle";
import { WorldVectorMap } from "../../components/Ui/VectorMap/";

const RevenueByLocationChart = ({ locationData = [], title = "Asset Distribution by Location" }) => {

  // Normalized fallback IT branch distribution data (Coordinates set to major Indian tech hubs)
  const defaultLocations = [
    { name: "Mumbai HQ", coords: [19.0760, 72.8777], count: "720", percentage: 72 },
    { name: "Bangalore Hub", coords: [12.9716, 77.5946], count: "610", percentage: 61 },
    { name: "Goa Office", coords: [15.2993, 74.1240], count: "390", percentage: 39 },
    { name: "Pune Branch", coords: [18.5204, 73.8567], count: "250", percentage: 25 },
  ];

  // Resolve whether to use live incoming state data or fallback configurations
  const activeDataList = locationData.length > 0 ? locationData : defaultLocations;

  // Dynamically map vector pin points based on our active database payload array
  const mapMarkers = activeDataList.map((loc) => ({
    name: loc.name,
    coords: loc.coords
  }));

  // Vector map chart options configurations block
  const mapOptions = {
    zoomOnScroll: false,
    markers: mapMarkers,
    markerStyle: {
      initial: {
        r: 7,
        fill: "#727cf5",
        "fill-opacity": 0.9,
        stroke: "#fff",
        "stroke-width": 4,
        "stroke-opacity": 0.4,
      },
      hover: {
        fill: "#727cf5",
        stroke: "#fff",
        "fill-opacity": 1,
        "stroke-width": 1.5,
      },
    },
    regionStyle: {
      initial: {
        fill: "#e3eaef",
      },
    },
  };

  return (
    <Card className="card-h-100">
      <Card.Body>
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between"
          title={title}
          menuItems={[
            { label: "Refresh Status" },
            { label: "View Infrastructure Map" },
            { label: "Export Audit Log" },
          ]}
        />

        {/* GEOLOCATION VECTOR RENDERING CORE */}
        <div className="mb-4 mt-4">
          <WorldVectorMap height="224px" width="100%" options={mapOptions} />
        </div>

        {/* DYNAMIC PROGRESS BAR GENERATOR LOOP */}
        <div className="location-distribution-list">
          {activeDataList.map((location, index) => (
            // Injected unique reconciliation mapping key securely here
            <div key={location.name || index} className="mb-3">
              <h5 className="mb-1 mt-0 fw-normal text-muted font-14">{location.name}</h5>
              <div className="progress-w-percent">
                <span className="progress-value fw-bold text-dark">{location.count} Units</span>
                <ProgressBar 
                  now={location.percentage} 
                  className="progress-sm" 
                  variant={location.percentage > 50 ? "primary" : "info"} 
                />
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RevenueByLocationChart;