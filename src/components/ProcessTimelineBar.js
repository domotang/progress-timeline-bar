"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBController } from "../lib/PTBController";
import { IoIosArrowBack } from "react-icons/io";

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
  var [pTBController] = useState(() => PTBController(templateAPI));
  var [eventPage, setEventPage] = useState(null);
  var [barTop, setBarTop] = useState(0);

  var eventDomElements = processDomEventComponents();
  var style1 = { top: 100, left: 150, position: "absolute" };

  var modalView = currentMode === "modal";

  var frog = {
    position: currentMode === "modal" ? "static" : "relative",
    height: currentMode != "large" ? 104 : 52,
    zIndex: currentMode === "modal" ? 100 : 0,
    transition: "all .3s"
    // backgroundColor: "blue"
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
    transition: "all .4s, z-index 0s .6s, backgroundColor 0s .6s"
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
    transform: `translate(20px, -${barTop - 10}px)`
  };

  useEffect(() => {
    pTBController.init(currentMode);
  }, []);

  useEffect(() => {
    if (eventPage) {
      setEventPage(null);
    }
    setCurrentMode(mode);
    pTBController.setMode(mode);
    setCurrentEvent(null);
  }, [mode]);

  function eventClick(eventId) {
    _checkSetBarTop();
    setCurrentMode("modal");
    setEventPage(null);

    pTBController.setEvent(eventId, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(eventId));
    });

    setCurrentEvent(eventId);
  }

  function barClick() {
    _checkSetBarTop();
    setCurrentMode("modal");
    pTBController.setMode("modal");
  }

  function backClick() {
    if (eventPage) {
      setEventPage(null);
    }
    pTBController.setMode("detail");
    setCurrentMode("detail");
    setCurrentEvent(null);
  }

  function pTLBClick() {
    if (listBar) setSelectedBar(id);
    pTBController.setMode("detail");
    setCurrentMode("detail");
  }

  function _checkSetBarTop() {
    if (currentMode != "modal")
      setBarTop(pTBController.getBarElement().getBoundingClientRect().top - 1);
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
        onClick={currentMode === "large" ? pTLBClick : null}
        // onFocus={mode != "detail" ? pTLBClick : null}
        // cursor={mode != "detail" ? "default" : "pointer"}
        cursor="default"
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
          currentMode={currentMode}
          icon={IoIosArrowBack}
        />

        <div style={style1} className="event-details">
          {eventPage}
        </div>
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
