"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBController } from "../lib/PTBController";

function ProcessTimeLineBar({
  styleOptions,
  template,
  children,
  title,
  detail,
  status,
  mode,
  id,
  setSelectedBar
}) {
  var [templateAPI] = useState(() =>
    template(styleOptions, children.length, status)
  );
  var [PTBar] = useState(() => templateAPI.getBarTmplt());
  var [PTBEvent] = useState(() => templateAPI.getEventTmplt());
  var [currentMode, setCurrentMode] = useState(mode);
  var [currentEvent, setCurrentEvent] = useState(null);
  var [headerMode, setHeaderMode] = useState("closed");
  var [pTBController] = useState(() => PTBController(templateAPI));
  var [eventPage, setEventPage] = useState(null);

  var eventDomElements = processDomEventComponents();

  useEffect(() => {
    pTBController.init(currentMode);
  }, []);

  useEffect(() => {
    if (eventPage) {
      setEventPage(null);
    }
    setCurrentMode(mode);
    pTBController.setMode(mode);
    setHeaderMode("closed");
  }, [mode]);

  function eventClick(eventId) {
    setEventPage(null);

    pTBController.setEvent(eventId, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(eventId));
    });

    setCurrentEvent(eventId);
  }

  function barClick() {
    pTBController.setHeader("detail");
    setHeaderMode("detail");
  }

  function pTLBClick() {
    setSelectedBar(id);
    pTBController.setMode("detail");
    setCurrentMode("detail");
  }

  function processDomEventComponents() {
    return children
      ? Children.map(children, (child, index) => {
          let eventAttributes = {
            detailPages: child.props.children,
            expandedHeight: child.props.expandedHeight
          };
          return cloneElement(child, {
            PTBEvent,
            eventClick,
            id: index,
            currentMode,
            opened: currentEvent === index ? true : false,
            isOnStatus: status == index + 1 ? true : false,
            isCompleted: status > index + 1 ? true : false,
            setRef: div => {
              pTBController.addEvent({
                ...eventAttributes,
                eventId: index,
                element: div,
                id
              });
            }
          });
        })
      : [];
  }

  console.log("render bar", id);

  return (
    <div
      className="proc-timeline"
      id={`proc-timeline-${id}`}
      style={{
        backgroundColor: styleOptions.backgroundColor,
        width: styleOptions.barWidth.large
      }}
      onClick={currentMode != "detail" ? pTLBClick : null}
      // onFocus={mode != "detail" ? pTLBClick : null}
      // cursor={mode != "detail" ? "default" : "pointer"}
      cursor="pointer"
      // role="button"
      // tabIndex="0"
      ref={div => pTBController.addBar({ barId: "procBar", element: div })}
    >
      <PTBar
        eventDomElements={eventDomElements}
        barClick={barClick}
        title={title}
        detail={detail}
        headerMode={headerMode}
        currentMode={currentMode}
      />

      <div style={{ top: 100 }} className="event-details">
        {eventPage}
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
