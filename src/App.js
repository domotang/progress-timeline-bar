import React, { useState } from "react";
import PTBMaterialTracker from "./lib/PTBmaterialTracker";
import ProcessTimelineBar from "./components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "./components/ProcessTimelineEvent";
import MaterialReceipt from "./components/details/MaterialReceipt";
import ShipmentPackages from "./components/details/ShipmentPackages";
import {
  FaCogs,
  FaPaperPlane,
  FaRegCalendarCheck,
  FaRegCheckCircle,
  FaRegFileAlt
} from "react-icons/fa";
import { MdAlarm } from "react-icons/md";
import { shippingData } from "./lib/testData";

function App() {
  var barStyleOptions = {
    backgroundColor: "#c3dde0",
    placeholderColor: "#ddeced",
    eventCompletedColor: "#541919",
    eventOnStatusColor: "#7d2828",
    expandedColor: "#e3e3e3",
    fontColor: "white",
    barWidth: { large: 1040, small: 400 }
  };
  var [selectedBar, setSelectedBar] = useState(0);

  return (
    <div className="parent">
      <div className="controls">
        <h1>Process Timeline Bar React Component Demo</h1>
      </div>

      {shippingData.map((shipment, index) => (
        <ProcessTimelineBar
          styleOptions={barStyleOptions}
          key={index}
          id={index}
          template={PTBMaterialTracker}
          title="SHIPMENTS"
          detail={shipment.shipment}
          mode={selectedBar === index ? "detail" : "large"}
          status={shipment.status}
          setSelectedBar={setSelectedBar}
        >
          <ProcessTimelineBarEvent
            title="OPENED"
            date={shipment.statusDates.opened}
            color="#7699c2"
            expandedHeight="280"
            icon={FaRegFileAlt}
          >
            <ShipmentPackages />
          </ProcessTimelineBarEvent>
          <ProcessTimelineBarEvent
            title="RECEIVED"
            date={shipment.statusDates.received}
            color="#6583a6"
            expandedHeight="300"
            icon={FaRegCalendarCheck}
          >
            <MaterialReceipt />
          </ProcessTimelineBarEvent>
          <ProcessTimelineBarEvent
            title="PACKED"
            date={shipment.statusDates.packed}
            color="#4a75a1"
            expandedHeight="400"
            icon={MdAlarm}
          />
          <ProcessTimelineBarEvent
            title="SHIPPED"
            date={shipment.statusDates.shipped}
            color="#3f658a"
            expandedHeight="160"
            icon={FaCogs}
          />
          <ProcessTimelineBarEvent
            title="IN TRANSIT"
            date={shipment.statusDates.inTransit}
            color="#325373"
            expandedHeight="200"
            icon={FaPaperPlane}
          />
          <ProcessTimelineBarEvent
            title="ARRIVED"
            date={shipment.statusDates.arrived}
            color="#1e4566"
            expandedHeight="270"
            icon={FaRegCheckCircle}
          >
            <ShipmentPackages />
          </ProcessTimelineBarEvent>
        </ProcessTimelineBar>
      ))}
    </div>
  );
}

export default App;
