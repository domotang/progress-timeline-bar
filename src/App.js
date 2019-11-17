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
        title="SHIPMENT"
        detail="HOU1-40264"
        expandedColor="#e3e3e3"
        mode={mode}
        status="3"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details fart" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
          icon={FaRegCalendarCheck}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
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
        mode="detail"
        status="6"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
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
        mode="detail"
        status="4"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
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
        mode="detail"
        status="4"
      >
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
          icon={FaRegFileAlt}
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="300"
          icon={FaRegCalendarCheck}
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
          icon={MdAlarm}
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
          icon={FaPaperPlane}
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
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
