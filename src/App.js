import React, { useState } from "react";
import PTBMaterialTracker from "./lib/PTBmaterialTracker";
import ProcessTimelineBar from "./components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "./components/ProcessTimelineEvent";
import TimelineEventPage from "./components/TimelineEventPage";
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

function App() {
  var [mode, setMode] = useState("detail");

  return (
    <div className="parent">
      <div className="controls">
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          onBlur={e => setMode(e.target.value)}
        >
          <option value="detail-header">Detail Header</option>
          <option value="detail">Detail</option>
          <option value="large">Large</option>
          <option value="small">Small</option>
        </select>
      </div>
      <ProcessTimelineBar
        template={PTBMaterialTracker}
        barWidth={{ large: 1040, small: 400 }}
        title="SHIPMENTS"
        detail="HOU1-40264"
        expandedColor="#e3e3e3"
        mode={mode}
        status="3"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          date="10/17/2019"
          color="#7699c2"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="File open details" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          date="11/2/2019"
          color="#6583a6"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          date="11/5/2019"
          color="#4a75a1"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#3f658a"
          expandedHeight="800"
          icon={FaRegCalendarCheck}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#325373"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#1e4566"
          expandedHeight="270"
          icon={FaRegCheckCircle}
        >
          <ShipmentPackages />
        </ProcessTimelineBarEvent>
      </ProcessTimelineBar>
      <ProcessTimelineBar
        template={PTBMaterialTracker}
        barWidth={{ large: 1040, small: 400 }}
        title="SHIPMENT"
        detail="HOU1-40265"
        expandedColor="#e3e3e3"
        mode={mode}
        status="5"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          date="10/18/2019"
          color="#7699c2"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          date="10/24/2019"
          color="#6583a6"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          date="10/26/2019"
          color="#4a75a1"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          date="10/28/2019"
          color="#3f658a"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          date="11/29/2019"
          color="#325373"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#1e4566"
          expandedHeight="270"
          icon={FaRegCheckCircle}
        >
          <ShipmentPackages />
        </ProcessTimelineBarEvent>
      </ProcessTimelineBar>
      <ProcessTimelineBar
        template={PTBMaterialTracker}
        barWidth={{ large: 1040, small: 400 }}
        title="SHIPMENT"
        detail="HOU1-40267"
        expandedColor="#e3e3e3"
        mode={mode}
        status="2"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          date="10/24/2019"
          color="#7699c2"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          date="11/18/2019"
          color="#6583a6"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#4a75a1"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#3f658a"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#325373"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#1e4566"
          expandedHeight="270"
          icon={FaRegCheckCircle}
        >
          <ShipmentPackages />
        </ProcessTimelineBarEvent>
      </ProcessTimelineBar>
      <ProcessTimelineBar
        template={PTBMaterialTracker}
        barWidth={{ large: 1040, small: 400 }}
        title="SHIPMENT"
        detail="HOU1-40269"
        expandedColor="#e3e3e3"
        mode={mode}
        status="6"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          date="10/25/2019"
          color="#7699c2"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          date="10/29/2019"
          color="#6583a6"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          date="11/4/2019"
          color="#4a75a1"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          date="11/7/2019"
          color="#3f658a"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          date="11/8/2019"
          color="#325373"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          date="11/20/2019"
          color="#1e4566"
          expandedHeight="270"
          icon={FaRegCheckCircle}
        >
          <ShipmentPackages />
        </ProcessTimelineBarEvent>
      </ProcessTimelineBar>
    </div>
  );
}

export default App;
