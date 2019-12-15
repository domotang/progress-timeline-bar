"use strict";
import React, { Children, cloneElement, useState, useEffect } from "react";
import { PTBController } from "../lib/PTBController";

function ProcessTimeLineBar({
  headerDetailPage: HeaderDetailPage,
  headerDetails,
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

  var eventDomElements = processDomEventComponents();
  var barPadding = 5;

  // var modalView = currentMode === "modal";

  // var modalStylePlaceholder = {
  //   position: currentMode === "modal" ? "static" : "relative",
  //   height:
  //     currentMode === "detail"
  //       ? templates.barHeights.detail + barPadding * 2
  //       : currentMode === "large"
  //       ? templates.barHeights.large + barPadding * 2
  //       : templates.barHeights.small,
  //   marginTop: "10px",
  //   marginLeft: "10px",
  //   transition: "all .4s"
  // };
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
  };

  var modalStyle = {
    width: styleOptions.barWidth.large,
    borderRadius: "5px",
    position: "relative"
  };

  var modalStyleOff = {
    ...modalStyle,
    backgroundColor: styleOptions.backgroundColor,
    zIndex: 0,
    padding: barPadding + "px",
    transition:
      "position .6s, transform .6s, background-color .6s, z-index 0s 1s"
  };

  var modalStyleOn = {
    ...modalStyle,
    backgroundColor: "rgba(211, 232, 235, 0.7)",
    width: styleOptions.barWidth.large,
    padding: "5px",
    zIndex: 100,
    transition: "transform .6s, background-color .6s,  zIndex 0s .6s",
    transform: `translate(20px, -${barTop - 10}px)`
  };

  var headerPageStyle = {
    top: 10,
    left: 170,
    position: "absolute"
  };

  var headerPageStyleOff = {
    ...headerPageStyle,
    opacity: 0,
    transition: "opacity 1s"
  };

  var headerPageStyleOn = {
    ...headerPageStyle,
    opacity: 1,
    transition: "opacity .2s .6s"
  };

  var eventPageStyle = {
    top: 100,
    left: 150,
    position: "absolute"
  };

  var eventPageStyleOff = {
    ...eventPageStyle,
    opacity: 0,
    transition: "opacity .2s"
  };

  var eventPageStyleOn = {
    ...eventPageStyle,
    opacity: 1,
    position: "absolute",
    transition: "opacity .2s"
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

  useEffect(() => {
    if (currentMode === "modal") {
      _checkSetBarTop();
    }
  }, [currentMode]);

  function eventClick(eventId) {
    console.log("click");
    setCurrentMode("modal");
    if (listBar) setModal(true);
    setEventPage(null);

    pTBController.setEvent(eventId, currentEvent).then(() => {
      setEventPage(pTBController.getDetailPages(eventId));
    });

    setCurrentEvent(eventId);
  }

  function barClick() {
    console.log("click");
    pTBController.setMode("modal").then(() => {
      setCurrentMode("modal");
      if (listBar) setModal(true);
    });
  }

  function backClick() {
    console.log("click");
    if (eventPage) {
      setEventPage(null);
    }
    pTBController.setMode("detail").then(() => {});
    setCurrentMode("detail");
    if (listBar) setModal(false);
    setCurrentEvent(null);
  }

  function closeEventsClick() {
    console.log("click");
    if (eventPage) {
      setEventPage(null);
    }
    pTBController.closeEvents();
    setCurrentEvent(null);
  }

  // function pTLBClick() {
  //   console.log("click small");
  //   // if (listBar) setSelectedBar(id);
  //   pTBController.setMode("small");
  //   setCurrentMode("small");
  //   if (listBar) setModal(false);
  // }
  function pTLBClick() {
    console.log("click");
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

  console.log("render bar", id, mode);

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
          closeEventsClick={closeEventsClick}
          title={title}
          detail={detail}
          currentMode={currentMode}
        />

        <div
          style={
            currentMode === "modal" ? headerPageStyleOn : headerPageStyleOff
          }
          className="header-details"
        >
          {currentMode === "modal" ? (
            <HeaderDetailPage
              fontColor={styleOptions.fontColor}
              headerDetails={headerDetails}
            />
          ) : null}
        </div>

        <div
          style={eventPage ? eventPageStyleOn : eventPageStyleOff}
          className="event-details"
        >
          {eventPage}
        </div>
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
