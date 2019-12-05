"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBController } from "../lib/PTBController";

function ProcessTimeLineBar({
  listBar,
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
  var style1 = { top: 100, left: 150, position: "absolute" };

  var modalView = headerMode === "detail" || currentEvent != null;

  var frog = {
    position: currentMode === "detail" ? "static" : "relative",
    height: currentMode === "detail" ? 106 : null,
    zIndex: currentMode === "detail" ? 100 : 0
  };

  var dog = {
    backgroundColor: styleOptions.backgroundColor,
    width: styleOptions.barWidth.large,
    zIndex: 0,
    position: "relative",
    borderRadius: "5px",
    padding: "5px",
    marginTop: "10px",
    marginLeft: "10px",
    transition: "all .4s .2s, z-index 0s .6s, backgroundColor 0s .6s"
  };

  var dog2 = {
    backgroundColor: "rgba(158, 183, 186, 0.8)",
    width: styleOptions.barWidth.large,
    position: "relative",
    borderRadius: "5px",
    padding: "5px",
    marginTop: "10px",
    marginLeft: "10px",
    zIndex: 100,
    transition: "transform .4s",
    transform: `translate(20px, -${
      pTBController.getBarElement()
        ? pTBController.getBarElement().offsetTop - 100
        : 0
    }px)`
    // top: "offset().top"
  };

  // window.innerHeight

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
    setCurrentEvent(null);
  }, [mode]);

  function eventClick(eventId) {
    console.log("Click!");
    setEventPage(null);

    pTBController.setEvent(eventId, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(eventId));
    });

    setCurrentEvent(eventId);
  }

  function barClick() {
    console.log("Click!");
    pTBController.setHeader("detail");
    setHeaderMode("detail");
  }

  function backClick() {
    console.log("Click!");
    if (eventPage) {
      setEventPage(null);
    }
    pTBController.setMode("detail");
    setCurrentMode("detail");
    setHeaderMode("closed");
    setCurrentEvent(null);
  }

  function pTLBClick() {
    console.log("Click!");
    if (listBar) setSelectedBar(id);
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

  console.log("render bar", id, modalView);

  return (
    <div className="pTBContainer" style={frog}>
      <div
        className="proc-timeline"
        id={`proc-timeline-${id}`}
        style={modalView ? dog2 : dog}
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
          backClick={backClick}
          title={title}
          detail={detail}
          headerMode={headerMode}
          currentMode={currentMode}
        />

        <div style={style1} className="event-details">
          {eventPage}
        </div>
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
