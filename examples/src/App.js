import React, { useState } from "react";
import { PTBTemplateContext } from "../../src/components/PTBTemplateContext";
import PTBTemplate from "../../src/templates/PTBMaterial";
import PTBListBox from "../../src/components/PTBListBox";
import ProcessTimelineBar from "../../src/components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "../../src/components/ProcessTimelineEvent";
import MaterialReceipt from "./detailPages/MaterialReceipt";
import ShipmentPackages from "./detailPages/ShipmentPackages";
import HeaderDetails from "./detailPages/HeaderDetails";
import {
  FaTruckLoading,
  FaPaperPlane,
  FaRegCheckCircle,
  FaBox,
  FaTruckMoving
} from "react-icons/fa";
import { GoFileSubmodule } from "react-icons/go";
import { shippingData } from "./lib/testData";
import initReactFastclick from "react-fastclick";
initReactFastclick();

// console.log("template", PTBTemplate);

function App() {
  var [mode, setMode] = useState("large");

  var barStyleOptions = {
    backgroundColor: "#c3dde0",
    placeholderColor: "#ddeced",
    eventCompletedColor: "#541919",
    eventOnStatusColor: "#7d2828",
    expandedColor: "#e3e3e3",
    fontColor: "white",
    barWidth: { large: 1040, small: 380 }
  };

  return (
    <div className="parent">
      <div className="controls">
        <h1>Process Timeline Bar React Component Demo</h1>
        Mode ({mode}){" "}
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          onBlur={e => setMode(e.target.value)}
        >
          <option key="1" value="large">
            Large
          </option>
          <option key="2" value="small">
            Small
          </option>
        </select>
      </div>

      {/* <div className="list"> */}
      <PTBTemplateContext template={PTBTemplate} styleOptions={barStyleOptions}>
        <PTBListBox mode={mode}>
          {shippingData.map((shipment, index) => (
            <ProcessTimelineBar
              headerDetailPage={HeaderDetails}
              key={index}
              id={index}
              title="SHIPMENT"
              detail={shipment.shipment}
              mode="large"
              scrollableEvents="true"
              eventWidth={150}
              status={shipment.listDetails.status}
              headerDetailsId={shipment.headerDetails}
            >
              <ProcessTimelineBarEvent
                title="OPENED"
                date={shipment.statusDates.opened}
                color="#7699c2"
                expandedHeight={280}
                icon={GoFileSubmodule}
              >
                <ShipmentPackages />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="RECEIVED"
                date={shipment.statusDates.received}
                color="#6583a6"
                expandedHeight={300}
                icon={FaTruckLoading}
              >
                <MaterialReceipt />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="PACKED"
                date={shipment.statusDates.packed}
                color="#4a75a1"
                expandedHeight={400}
                icon={FaBox}
              />
              <ProcessTimelineBarEvent
                title="SHIPPED"
                date={shipment.statusDates.shipped}
                color="#3f658a"
                expandedHeight={160}
                icon={FaTruckMoving}
              />
              <ProcessTimelineBarEvent
                title="IN TRANSIT"
                date={shipment.statusDates.inTransit}
                color="#325373"
                expandedHeight={200}
                icon={FaPaperPlane}
              />
              <ProcessTimelineBarEvent
                title="ARRIVED"
                date={shipment.statusDates.arrived}
                color="#1e4566"
                expandedHeight={270}
                icon={FaRegCheckCircle}
              >
                <ShipmentPackages />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="TEST 1"
                date={shipment.statusDates.inTransit}
                color="#325373"
                expandedHeight={200}
                icon={FaPaperPlane}
              />
              <ProcessTimelineBarEvent
                title="TEST 2"
                date={shipment.statusDates.arrived}
                color="#1e4566"
                expandedHeight={270}
                icon={FaRegCheckCircle}
              >
                <ShipmentPackages />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="TEST 3"
                date={shipment.statusDates.arrived}
                color="#1e4566"
                expandedHeight={270}
                icon={FaRegCheckCircle}
              >
                <ShipmentPackages />
              </ProcessTimelineBarEvent>
            </ProcessTimelineBar>
          ))}
        </PTBListBox>
      </PTBTemplateContext>
      {/* </div> */}
    </div>
  );
}

export default App;
