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
  setSelectedBar,
  setModal
}) {
  var [templateAPI] = useState(() =>
    template(styleOptions, children.length, status)
  );
  var [templates] = useState(() => templateAPI.getTemplates());
  var [currentMode, setCurrentMode] = useState(mode);
  var [currentEvent, setCurrentEvent] = useState(null);
  var [pTBController] = useState(() => PTBController(templateAPI));
  var [eventPage, setEventPage] = useState(null);
  var [barTop, setBarTop] = useState(0);
  var [zIndex, setZIndex] = useState(0);

  var eventDomElements = processDomEventComponents();
  var barPadding = 5;

  var modalView = currentMode === "modal";

  var modalStylePlaceholder = {
    position: currentMode === "modal" ? "static" : "relative",
    height:
      currentMode != "large"
        ? templates.barHeights.detail + barPadding * 2
        : templates.barHeights.large + barPadding * 2,
    marginTop: "10px",
    marginLeft: "10px",
    transition: "all .4s"
    // backgroundColor: "blue"
  };

  var modalStyleOff = {
    backgroundColor: styleOptions.backgroundColor,
    width: styleOptions.barWidth.large,
    zIndex: zIndex,
    position: "relative",
    borderRadius: "5px",
    padding: barPadding + "px",
    transition: "position .6s, transform .6s, backgroundColor .6s"
  };

  var modalStyleOn = {
    backgroundColor: "rgba(211, 232, 235, 0.7)",
    width: styleOptions.barWidth.large,
    position: "relative",
    borderRadius: "5px",
    padding: "5px",
    zIndex: 100,
    transition: "transform .6s, backgroundColor .6s",
    transform: `translate(20px, -${barTop - 10}px)`
  };

  var eventPageStyle = { top: 100, left: 150, position: "absolute" };

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
    setZIndex(100);
    if (listBar) setModal(true);
    setEventPage(null);

    pTBController.setEvent(eventId, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(eventId));
    });

    setCurrentEvent(eventId);
  }

  function barClick() {
    _checkSetBarTop();
    pTBController.setMode("modal").then(() => {
      setCurrentMode("modal");
      setZIndex(100);
      if (listBar) setModal(true);
    });
  }

  function backClick() {
    if (eventPage) {
      setEventPage(null);
    }
    pTBController.setMode("detail").then(() => {
      setZIndex(0);
    });
    setCurrentMode("detail");
    // pTBController.setMode("detail").then(() => {
    //   setCurrentMode("detail");
    // });
    if (listBar) setModal(false);
    setCurrentEvent(null);
  }

  function pTLBClick() {
    if (listBar) setSelectedBar(id);
    pTBController.setMode("detail");
    setCurrentMode("detail");
    if (listBar) setModal(false);
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
            Event: templates.event,
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

  // console.log("render bar", id, modalView);

  return (
    <div className="pTBContainer" style={modalStylePlaceholder}>
      <div
        className="proc-timeline"
        id={`proc-timeline-${id}`}
        style={modalView ? modalStyleOn : modalStyleOff}
        onClick={currentMode === "large" ? pTLBClick : null}
        // onFocus={currentMode === "large" ? pTLBClick : null}
        // cursor={mode != "detail" ? "default" : "pointer"}
        cursor="pointer"
        // role="button"
        // tabIndex="0"
        ref={div => pTBController.addBar({ barId: "procBar", element: div })}
      >
        <templates.bar
          eventDomElements={eventDomElements}
          barClick={barClick}
          backClick={backClick}
          title={title}
          detail={detail}
          currentMode={currentMode}
          icon={IoIosArrowBack}
        />

        <div style={eventPageStyle} className="event-details">
          {eventPage}
        </div>
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
