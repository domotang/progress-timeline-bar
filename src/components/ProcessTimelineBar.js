"use strict";
import React, {
  Children,
  cloneElement,
  useState,
  useEffect,
  useRef
} from "react";
import { PTBController } from "../lib/PTBController";

function ProcessTimeLineBar({
  styleOptions,
  template,
  children,
  title,
  detail,
  status,
  mode: initMode,
  firstInList,
  id,
  setSelectedBar
}) {
  var barf = useRef(initMode);
  var [templateAPI] = useState(() =>
    template(styleOptions, children.length, status)
  );
  var [PTBar] = useState(() => templateAPI.getBarTmplt());
  var [PTBEvent] = useState(() => templateAPI.getEventTmplt());
  var [mode, setMode] = useState(firstInList ? "detail" : initMode);
  // var [currentEvent, setCurrentEvent] = useState();
  // var [headerMode, setHeaderMode] = useState("closed");
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
    barf.current = tempMode;
    pTBController.setMode(tempMode);
  }, [tempMode]);

  function eventClick(eventId) {
    var currentEvent = pTBController.getCurrentEvent()
      ? pTBController.getCurrentEvent().getId()
      : null;
    if (eventId != currentEvent) {
      setEventPage(null);

      pTBController.setEvent(eventId, currentEvent).then(() => {
        setEventPage(pTBController.getDetailPages(eventId));
      });

      // setCurrentEvent(eventId);
    }
  }

  function barClick() {
    if (pTBController.getCurrentHeaderMode() === "closed") {
      pTBController.setHeader("detail");
    }
  }

  function pTLBClick() {
    if (mode === "large") {
      setSelectedBar(id);
      pTBController.setMode("detail");
      setMode("detail");
      barf.current = "detail";
    }
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
            initMode,
            barf,
            isOnStatus: status == index + 1 ? true : false,
            isCompleted: status > index + 1 ? true : false,
            setRef: div =>
              pTBController.addEvent({
                ...eventAttributes,
                eventId: index,
                element: div
              })
          });
        })
      : [];
  }
  // processDomEventComponents();
  console.log("render bar");

  return (
    <div
      className="proc-timeline"
      style={{
        backgroundColor: styleOptions.backgroundColor,
        width: styleOptions.barWidth.large
      }}
      onClick={mode != "detail" ? pTLBClick : null}
      // onFocus={mode != "detail" ? pTLBClick : null}
      cursor={mode != "detail" ? "default" : "pointer"}
      // role="button"
      // tabIndex="0"
      ref={div => pTBController.addBar({ barId: "procBar", element: div })}
    >
      <PTBar
        eventDomElements={eventDomElements}
        barClick={barClick}
        title={title}
        detail={detail}
        mode={mode}
      />

      <div style={{ top: 100 }} className="event-details">
        {eventPage}
      </div>
    </div>
  );
}

export default ProcessTimeLineBar;
