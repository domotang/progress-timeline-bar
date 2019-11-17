"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBBuilder } from "../lib/ProcessTimelineBarFact";

function ProcessTimeLineBar({
  template,
  barWidth,
  children,
  title,
  detail,
  status,
  mode: initMode
}) {
  var xFactor = 880 / children.length;
  var width = xFactor - 15;
  var timelineBarWidth = status > 0 ? xFactor * status + 48 : 196;

  var [templateAPI] = useState(() => template(barWidth));
  var [mode, setMode] = useState(initMode);
  var [currentEvent, setCurrentEvent] = useState();
  var [eventDomElements] = useState(() => processDomElementComponents());
  var [procTimelineBar] = useState(() => PTBBuilder());
  var [eventPage, setEventPage] = useState(null);

  useEffect(() => {
    setMode(initMode);
    procTimelineBar.setMode(initMode);
  }, [initMode]);

  useEffect(() => {
    procTimelineBar.generateAnimations();
  }, []);

  function eventClick(e) {
    let newSelectedEvent = e.target
      .closest(".top-element-node")
      .getAttribute("id");

    if (newSelectedEvent === "bar") {
      procTimelineBar.setMode("detail-header");
      return;
    }

    setEventPage(null);

    procTimelineBar.setEvent(newSelectedEvent, currentEvent).then(() => {
      setEventPage(procTimelineBar.getDetailPages(newSelectedEvent));
    });

    setCurrentEvent(newSelectedEvent);
  }

  function processDomElementComponents() {
    return children
      ? Children.map(children, (child, index) => {
          let eventAttributes = {
            eventId: `event-${index}`,
            detailPages: child.props.children,
            expandedHeight: child.props.expandedHeight
          };
          return cloneElement(child, {
            x: index * xFactor,
            width,
            id: index,
            eventClick,
            setRef: div =>
              procTimelineBar.addEvent({ ...eventAttributes, element: div })
          });
        })
      : [];
  }

  console.log("render");

  return (
    <div className="proc-timeline">
      <svg
        className="proc-timeline-svg"
        ref={div => procTimelineBar.addBar({ barId: "procBar", element: div })}
        id="tool-bar"
        data-name="proc-timeline-svg"
        xmlns="http://www.w3.org/2000/svg"
        width="1040"
        height="90"
      >
        <g className="top-element-node" id={`bar`}>
          <path
            onClick={eventClick}
            className="header-bar"
            id={`rect-`}
            d={`M0,0 h${timelineBarWidth} a6,6,0,0,1,6,5 l5, 13 h-${timelineBarWidth -
              157} a7,7,0,0,0,-7,7 l-20, 57 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`}
            transform={`translate(6, 0)`}
            fill="#4E63C2"
          />
          {status > 0 ? (
            <circle cx={timelineBarWidth + 36} cy="9" r="9" fill="red" />
          ) : null}
          <text
            className="title"
            x="14"
            y="19"
            fontFamily="Verdana"
            fontSize="12"
            fontWeight="bold"
            fill="white"
          >
            {title}
          </text>
          <text
            className="detail"
            x="14"
            y="39"
            fontFamily="Verdana"
            fontSize="14"
            fontWeight="bold"
            fill="white"
          >
            {detail}
          </text>
          {eventDomElements}
        </g>
      </svg>
      <div className="event-details">{eventPage}</div>
    </div>
  );
}

export default ProcessTimeLineBar;
