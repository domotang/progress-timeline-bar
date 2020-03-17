import React, { useState, useEffect } from "react";
import { PTBTemplateContext } from "./components/PTBTemplateContext";
import PTBTemplateMaterial from "./template/PTBTemplateMaterial";
import PTBListBox from "./components/PTBListBox";
import ProcessTimelineBar from "./components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "./components/ProcessTimelineEvent";
import MaterialReceipt from "./components/details/MaterialReceipt";
import ShipmentPackages from "./components/details/ShipmentPackages";
import HeaderDetails from "./components/details/HeaderDetails";
import {
  FaTruckLoading,
  FaPaperPlane,
  FaRegCheckCircle,
  FaBox,
  FaTruckMoving
} from "react-icons/fa";
import { GoFileSubmodule } from "react-icons/go";
import initReactFastclick from "react-fastclick";
initReactFastclick();

function App() {
  var [mode, setMode] = useState("large");
  var [shipData, setShipData] = useState();

  useEffect(() => {
    getShipData();
    setInterval(() => {
      getShipData();
    }, 5000);
  }, []);

  var barStyleOptions = {
    backgroundColor: "#c3dde0",
    placeholderColor: "#ddeced",
    eventCompletedColor: "#541919",
    eventOnStatusColor: "#7d2828",
    expandedColor: "#e3e3e3",
    fontColor: "white",
    barWidth: { large: 1040, small: 380 }
  };

  function getShipData() {
    fetch("http://10.0.0.230:8000/api")
      .then(response => {
        return response.json();
      })
      .then(data => {
        setShipData(data);
      });
  }

  if (!shipData) {
    return <div>Loading</div>;
  }

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
      <PTBTemplateContext
        template={PTBTemplateMaterial}
        styleOptions={barStyleOptions}
      >
        <PTBListBox mode={mode}>
          {shipData.map((shipment, index) => (
            <ProcessTimelineBar
              headerDetailPage={HeaderDetails}
              key={index}
              id={index}
              title="SHIPMENT"
              detail={shipment._number}
              mode="large"
              scrollableEvents="true"
              status={shipment._status}
              headerDetailsId={shipment._id}
            >
              <ProcessTimelineBarEvent
                title="OPENED"
                date={shipment._date_opened}
                color="#7699c2"
                expandedHeight={280}
                icon={GoFileSubmodule}
              >
                <ShipmentPackages />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="RECEIVED"
                date={shipment._date_received}
                color="#6583a6"
                expandedHeight={300}
                icon={FaTruckLoading}
              >
                <MaterialReceipt />
              </ProcessTimelineBarEvent>
              <ProcessTimelineBarEvent
                title="PACKED"
                date={shipment._date_packed}
                color="#4a75a1"
                expandedHeight={400}
                icon={FaBox}
              />
              <ProcessTimelineBarEvent
                title="SHIPPED"
                date={shipment._date_shipped}
                color="#3f658a"
                expandedHeight={160}
                icon={FaTruckMoving}
              />
              <ProcessTimelineBarEvent
                title="IN TRANSIT"
                date={shipment._date_intransit}
                color="#325373"
                expandedHeight={200}
                icon={FaPaperPlane}
              />
              <ProcessTimelineBarEvent
                title="ARRIVED"
                date={shipment._date_arrived}
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
