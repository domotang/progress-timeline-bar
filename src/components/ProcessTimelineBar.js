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
  var [templateAPI] = useState(() =>
    template(barWidth, children.length, status)
  );
  var [PTBar] = useState(() => templateAPI.getBarTmplt());
  var [PTBEvent] = useState(() => templateAPI.getEventTmplt());
  var [mode, setMode] = useState(initMode);
  var [currentEvent, setCurrentEvent] = useState();
  var [eventDomElements] = useState(() => processDomEventComponents());
  var [procTimelineBar] = useState(() => PTBBuilder(templateAPI));
  var [eventPage, setEventPage] = useState(null);

  useEffect(() => {
    setMode(initMode);
    procTimelineBar.setMode(initMode);
  }, [initMode]);

  useEffect(() => {
    templateAPI.generateAnimations();
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

  function processDomEventComponents() {
    return children
      ? Children.map(children, (child, index) => {
          let eventAttributes = {
            eventId: `event-${index}`,
            detailPages: child.props.children,
            expandedHeight: child.props.expandedHeight
          };
          return cloneElement(child, {
            PTBEvent,
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
      <PTBar
        addBar={procTimelineBar.addBar}
        eventDomElements={eventDomElements}
        eventClick={eventClick}
        title={title}
        detail={detail}
      />
      <div
        style={{ top: procTimelineBar.getEventDetailTop() }}
        className="event-details"
      >
        {eventPage}
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
