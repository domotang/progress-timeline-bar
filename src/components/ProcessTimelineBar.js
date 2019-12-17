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
  var barPadding = 5;

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
      if (openedEvent) {
        pTBController.setMode(currentMode).then(() => {
          setModalView(modal);
        });
      } else setModalView(modal);
      if (listBar) {
        setModal(true);
      }
    }
    if (!modal) {
      setCurrentEvent(null);
      pTBController.setMode(currentMode);
      setModalView(modal);
      setModal(false);
    }

    if (currentMode === "detail") if (listBar) setSelectedBar(id);
  }, [currentMode]);

  useEffect(() => {
    if (eventPage) {
      setEventPage(null);
    }
    if (currentEvent != null) {
      pTBController.setEvent(currentEvent).then(() => {
        setEventPage(pTBController.getDetailPages(currentEvent));
      });
    } else if (currentMode === "modal") pTBController.closeEvents();
  }, [currentEvent]);

  var modalStylePlaceholder = {
    position: modalView ? "static" : "relative",
    height:
      currentMode != "large"
        ? templateAPI.barHeights.detail + barPadding * 2
        : templateAPI.barHeights.large + barPadding * 2,
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
    <div className="pTBContainer" style={modalStylePlaceholder}>
      <div
        className="proc-timeline"
        id={`proc-timeline-${id}`}
        style={modalView ? modalStyleOn : modalStyleOff}
        onClick={
          currentMode === "large"
            ? () => {
                barClick("detail");
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
        ref={div => pTBController.addBar({ barId: "procBar", element: div })}
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
