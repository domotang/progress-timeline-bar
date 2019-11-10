import React from "react";
import ProcessTimelineBar from "./components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "./components/ProcessTimelineEvent";
import TimelineEventPage from "./components/TimelineEventPage";
import MaterialReceipt from "./components/details/MaterialReceipt";
import ShipmentPackages from "./components/details/ShipmentPackages";

function App() {
  return (
    <div className="parent">
      <ProcessTimelineBar expandedColor="#e3e3e3">
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
        >
          <TimelineEventPage title="opened details 1" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="300"
        >
          <MaterialReceipt />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
          expandedHeight="270"
        >
          <ShipmentPackages />
        </ProcessTimelineBarEvent>
      </ProcessTimelineBar>
      <ProcessTimelineBar expandedColor="#e3e3e3">
        <ProcessTimelineBarEvent
          title="OPENED"
          color="#87a2c7"
          expandedHeight="280"
        >
          <TimelineEventPage title="opened details 2" />
        </ProcessTimelineBarEvent>
        <ProcessTimelineBarEvent
          title="RECEIVED"
          color="#29abe2"
          expandedHeight="600"
        />
        <ProcessTimelineBarEvent
          title="PACKED"
          color="#ffcc00"
          expandedHeight="400"
        />
        <ProcessTimelineBarEvent
          title="SHIPPED"
          color="#9c2919"
          expandedHeight="800"
        />
        <ProcessTimelineBarEvent
          title="IN TRANSIT"
          color="#3865a3"
          expandedHeight="200"
        />
        <ProcessTimelineBarEvent
          title="ARRIVED"
          color="#64a338"
          expandedHeight="400"
        />
      </ProcessTimelineBar>
    </div>
  );
}

export default App;
