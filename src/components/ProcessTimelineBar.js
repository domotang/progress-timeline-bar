"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBController } from "../lib/PTBController";

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
  var [pTBController] = useState(() => PTBController(templateAPI));
  var [eventPage, setEventPage] = useState(null);

  useEffect(() => {
    setMode(initMode);
    pTBController.setMode(initMode);
  }, [initMode]);

  useEffect(() => {
    pTBController.init();
  });

  function eventClick(e) {
    let newSelectedEvent = e.target
      .closest(".top-element-node")
      .getAttribute("id");

    if (newSelectedEvent === "bar") {
      pTBController.setMode("detail-header");
      return;
    }

    setEventPage(null);

    pTBController.setEvent(newSelectedEvent, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(newSelectedEvent));
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
            isOnStatus: status == index + 1 ? true : false,
            setRef: div =>
              pTBController.addEvent({ ...eventAttributes, element: div })
          });
        })
      : [];
  }

  console.log("render");

  return (
    <div className="proc-timeline">
      <PTBar
        addBar={pTBController.addBar}
        eventDomElements={eventDomElements}
        eventClick={eventClick}
        title={title}
        detail={detail}
      />
      <div
        style={{ top: pTBController.getEventDetailTop() }}
        className="event-details"
      >
        {eventPage}
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
