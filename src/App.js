import React from "react";
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

var iconCogs =
  "M512.1 191l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0L552 6.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zm-10.5-58.8c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.7-82.4 14.3-52.8 52.8zM386.3 286.1l33.7 16.8c10.1 5.8 14.5 18.1 10.5 29.1-8.9 24.2-26.4 46.4-42.6 65.8-7.4 8.9-20.2 11.1-30.3 5.3l-29.1-16.8c-16 13.7-34.6 24.6-54.9 31.7v33.6c0 11.6-8.3 21.6-19.7 23.6-24.6 4.2-50.4 4.4-75.9 0-11.5-2-20-11.9-20-23.6V418c-20.3-7.2-38.9-18-54.9-31.7L74 403c-10 5.8-22.9 3.6-30.3-5.3-16.2-19.4-33.3-41.6-42.2-65.7-4-10.9.4-23.2 10.5-29.1l33.3-16.8c-3.9-20.9-3.9-42.4 0-63.4L12 205.8c-10.1-5.8-14.6-18.1-10.5-29 8.9-24.2 26-46.4 42.2-65.8 7.4-8.9 20.2-11.1 30.3-5.3l29.1 16.8c16-13.7 34.6-24.6 54.9-31.7V57.1c0-11.5 8.2-21.5 19.6-23.5 24.6-4.2 50.5-4.4 76-.1 11.5 2 20 11.9 20 23.6v33.6c20.3 7.2 38.9 18 54.9 31.7l29.1-16.8c10-5.8 22.9-3.6 30.3 5.3 16.2 19.4 33.2 41.6 42.1 65.8 4 10.9.1 23.2-10 29.1l-33.7 16.8c3.9 21 3.9 42.5 0 63.5zm-117.6 21.1c59.2-77-28.7-164.9-105.7-105.7-59.2 77 28.7 164.9 105.7 105.7zm243.4 182.7l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0l8.2-14.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zM501.6 431c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.6-82.4 14.3-52.8 52.8z";

// var FaBug =
//   '<path d="M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z"></path>';

function App() {
  return (
    <div className="parent">
      <ProcessTimelineBar
        title="SHIPMENT"
        detail="HOU1-40264"
        expandedColor="#e3e3e3"
        status="3"
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
          icon={iconCogs}
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
        title="SHIPMENT"
        detail="HOU1-40265"
        expandedColor="#e3e3e3"
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
        title="SHIPMENT"
        detail="HOU1-40267"
        expandedColor="#e3e3e3"
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
