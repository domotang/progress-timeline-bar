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
  headerDetailsId,
  listBar,
  children,
  title,
  detail,
  status,
  mode,
  scrollableEvents,
  eventWidth,
  id,
  setSelectedBar,
  setModal
}) {
  const Template = useContext(TemplateContext);
  const [pTBController] = useState(() =>
    PTBController(Template(children.length, status, eventWidth))
  );
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventPage, setEventPage] = useState(null);

  var eventDomElements = processDomEventComponents();
  const styleOptions = pTBController.getStyles();

  useEffect(() => {
    pTBController.init(currentMode);
  }, []);

  useEffect(() => {
    setCurrentMode(mode);
    setCurrentEvent(null);
  }, [mode]);

  useEffect(() => {
    var modal = currentMode === "modal";
    var openedEvent = currentEvent != null;

    if (eventPage) {
      setEventPage(null);
    }

    if (modal) {
      let opts = {
        barTop: _getBarTop()
      };
      if (!openedEvent) {
        pTBController.setMode(currentMode, opts);
      }

      if (listBar) {
        setModal(true);
      }
    }
    if (!modal) {
      setCurrentEvent(null);
      pTBController.setMode(currentMode);
      if (listBar) {
        setModal(false);
      }
    }

    if (currentMode === "detail") if (listBar) setSelectedBar(id);
  }, [currentMode]);

  useEffect(() => {
    let opts = {
      barTop: _getBarTop()
    };
    if (currentEvent != null) {
      pTBController.setEvent(currentEvent, opts).then(() => {
        setEventPage(pTBController.getDetailPages(currentEvent));
      });
    } else if (currentMode === "modal") pTBController.closeEvents();
  }, [currentEvent]);

  function eventClick(eventId) {
    console.log("click");
    setCurrentMode("modal");
    setCurrentEvent(eventId);
  }

  function barClick(mode) {
    console.log("click");
    setCurrentMode(mode);
  }

  function _getBarTop() {
    return pTBController.getBarElement().getBoundingClientRect().top - 10;
  }

  function processDomEventComponents() {
    return children
      ? Children.map(children, (child, index) => {
          var eventAttributes = {
            detailPages: child.props.children,
            expandedHeight: child.props.expandedHeight
          };
          return cloneElement(child, {
            Event: pTBController.Event,
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

  if (id === 0) console.log("render bar", id, mode);

  return (
    <div
      className="ptbcontainer"
      ref={div => pTBController.addBar({ barId: "procBar", element: div })}
    >
      <div
        className="proc-timeline"
        id={`proc-timeline-${id}`}
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
          //add small call
        }
        cursor="pointer"
      >
        <div className="header-details">
          {currentMode === "modal" && HeaderDetailPage ? (
            <HeaderDetailPage
              fontColor={styleOptions.fontColor}
              headerDetailsId={headerDetailsId}
            />
          ) : null}
        </div>
        <pTBController.Bar
          eventDomElements={eventDomElements}
          barClick={barClick}
          eventClick={eventClick}
          title={title}
          detail={detail}
          currentMode={currentMode}
          mode={mode}
          scrollableEvents={scrollableEvents}
          eventWidth={eventWidth}
        />
        <div className="event-details">{eventPage}</div>
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
