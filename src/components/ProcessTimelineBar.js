"use strict";
import React, {
  Children,
  cloneElement,
  useState,
  useEffect,
  useContext
} from "react";
import { TemplateContext } from "./PTBTemplateContext";
import { PTBController } from "../lib/PTBController";

function ProcessTimeLineBar({
  headerDetailPage: HeaderDetailPage,
  headerDetails,
  listBar,
  children,
  title,
  detail,
  status,
  mode,
  id,
  setSelectedBar,
  setModal
}) {
  const Template = useContext(TemplateContext);
  const [templateAPI] = useState(() => Template(children.length, status));
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [pTBController] = useState(() => PTBController(templateAPI));
  const [eventPage, setEventPage] = useState(null);
  const [barTop, setBarTop] = useState(0);
  const [modalView, setModalView] = useState(false);

  var eventDomElements = processDomEventComponents();
  const styleOptions = templateAPI.getStyles();

  useEffect(() => {
    pTBController.init(currentMode);
  }, []);

  useEffect(() => {
    setCurrentMode(mode);
    setCurrentEvent(null);
  }, [mode]);

  useEffect(() => {
    var modal = currentMode === "modal";
    var openedEvent = currentEvent === null;

    if (eventPage) {
      setEventPage(null);
    }

    if (modal) {
      let opts = {
        barTop: pTBController.getBarElement().getBoundingClientRect().top - 1
      };
      if (openedEvent && mode === "detail") {
        pTBController.setMode(currentMode, opts).then(() => {
          setModalView(modal);
        });
      } else if (openedEvent && mode === "small") {
        pTBController.setMode(currentMode, opts);
        setModalView(modal);
      } else {
        setModalView(modal);
      }
      if (listBar) {
        setModal(true);
      }
    }
    if (!modal) {
      setCurrentEvent(null);
      pTBController.setMode(currentMode);
      setModalView(modal);
      if (listBar) {
        setModal(false);
      }
    }

    if (currentMode === "detail") if (listBar) setSelectedBar(id);
  }, [currentMode]);

  useEffect(() => {
    let opts = {
      barTop: pTBController.getBarElement().getBoundingClientRect().top - 1
    };
    if (eventPage) {
      setEventPage(null);
    }
    if (currentEvent != null) {
      pTBController.setEvent(currentEvent, opts).then(() => {
        setEventPage(pTBController.getDetailPages(currentEvent));
      });
    } else if (currentMode === "modal") pTBController.closeEvents();
  }, [currentEvent]);

  var modalStylePlaceholder = {
    position: "relative",
    // position: modalView ? "static" : "relative",
    marginTop: currentMode === "small" ? "3px" : "10px",
    marginLeft: "10px"
    // backgroundColor: "blue"
  };

  var modalStyle = {
    width:
      currentMode === "small"
        ? styleOptions.barWidth.small
        : styleOptions.barWidth.large,
    borderRadius: "5px",
    position: "relative"
  };

  var modalStyleOff = {
    ...modalStyle,
    backgroundColor: styleOptions.backgroundColor,
    zIndex: 0,
    padding: currentMode === "small" ? "3px" : "5px",
    transition:
      "position .6s, transform .6s, background-color .6s, z-index 0s 1s"
  };

  var modalStyleOn = {
    ...modalStyle,
    backgroundColor: "rgba(211, 232, 235, 0.7)",
    padding: "5px",
    zIndex: 100,
    transition: "transform .6s, background-color .6s,  zIndex 0s .6s"
    // transform: `translate(20px, -${barTop - 10}px)`
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
    transition: mode === "detail" ? "opacity .2s .6s" : "opacity .2s 1.4s"
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

  function eventClick(eventId) {
    _setBarTop();
    console.log("click");
    setCurrentMode("modal");
    setCurrentEvent(eventId);
  }

  function barClick(mode) {
    _setBarTop();
    console.log("click");
    setCurrentMode(mode);
  }

  function _setBarTop() {
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
            Event: templateAPI.event,
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

  // console.log("render bar", id, mode);

  return (
    <div
      className="ptbcontainer"
      ref={div => pTBController.addBar({ barId: "procBar", element: div })}
      style={modalStylePlaceholder}
    >
      <div
        className="proc-timeline"
        id={`proc-timeline-${id}`}
        style={modalView ? modalStyleOn : modalStyleOff}
        onClick={
          currentMode === "large"
            ? () => {
                barClick("detail");
              }
            : currentMode === "small"
            ? () => {
                barClick("modal");
              }
            : null
        }
        onKeyDown={
          currentMode === "large"
            ? () => {
                barClick("detail");
              }
            : null
        }
        cursor="pointer"
      >
        <div
          style={modalView ? headerPageStyleOn : headerPageStyleOff}
          className="header-details"
        >
          {currentMode === "modal" ? (
            <HeaderDetailPage
              fontColor={styleOptions.fontColor}
              headerDetails={headerDetails}
            />
          ) : null}
        </div>
        <templateAPI.bar
          eventDomElements={eventDomElements}
          barClick={barClick}
          eventClick={eventClick}
          title={title}
          detail={detail}
          currentMode={currentMode}
          mode={mode}
        />
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
