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
  mode: initMode,
  firstInList,
  id,
  setSelectedBar
}) {
  var [templateAPI] = useState(() =>
    template(barWidth, children.length, status)
  );
  var [PTBar] = useState(() => templateAPI.getBarTmplt());
  var [PTBEvent] = useState(() => templateAPI.getEventTmplt());
  var [mode, setMode] = useState(firstInList ? "detail" : initMode);
  var [currentEvent, setCurrentEvent] = useState();
  var [eventDomElements] = useState(() => processDomEventComponents());
  var [pTBController] = useState(() => PTBController(templateAPI));
  var [eventPage, setEventPage] = useState(null);

  var tempMode = initMode;

  useEffect(() => {
    pTBController.init(mode);
    tempMode = mode;
  }, []);

  useEffect(() => {
    setEventPage(null);
    setMode(tempMode);
    pTBController.setMode(tempMode);
  }, [tempMode]);

  function eventClick(e) {
    if (mode === "detail") {
      let newSelectedEvent = e.target
        .closest(".top-element-node")
        .getAttribute("id");

      if (newSelectedEvent === "bar") {
        pTBController.setHeader("detail");
        return;
      }
      setEventPage(null);

      pTBController.setEvent(newSelectedEvent, currentEvent).then(() => {
        setEventPage(pTBController.getDetailPages(newSelectedEvent));
      });

      setCurrentEvent(newSelectedEvent);
    }

    if (mode === "large") {
      setSelectedBar(id);
      let newSelectedBar = e.target.closest(".proc-timeline-svg");
      pTBController.setMode("detail");
      setMode("detail");
    }
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
            isOnStatus: status == index + 1 ? true : false,
            setRef: div =>
              pTBController.addEvent({ ...eventAttributes, element: div })
          });
        })
      : [];
  }

  console.log("render", mode);

  return (
    <div
      className="proc-timeline"
      ref={div => pTBController.addBar({ barId: "procBar", element: div })}
    >
      <PTBar
        eventDomElements={eventDomElements}
        eventClick={eventClick}
        title={title}
        detail={detail}
      />
      <div style={{ top: 100 }} className="event-details">
        {eventPage}
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
