import React, {
  Children,
  cloneElement,
  useState,
  useEffect,
  useRef
} from "react";
import {
  generateAniTimeLines,
  controlAnimation
} from "../lib/ProcTimelinePlugin";

function ProcessTimeLineBar({ children }) {
  var bar = null;
  var xFactor = 880 / children.length;
  var width = xFactor - 15;
  var eventElements = useRef({});

  // var [barMode, setBarMode] = useState("detail");
  var [currentEvent, setCurrentEvent] = useState();
  var [eventDomElements] = useState(() => processDomElementComponents());
  var [eventPage, setEventPage] = useState(null);

  useEffect(() => {
    generateAniTimeLines(bar, eventElements.current);
    console.log(eventElements.current);
  }, []);

  function eventClick(e) {
    let newSelectedEvent = e.target.parentNode.getAttribute("id");

    setEventPage(null);

    controlAnimation.play(
      eventElements.current,
      bar,
      currentEvent,
      newSelectedEvent,
      setCurrentEvent,
      setEventPage
    );
  }

  function processDomElementComponents() {
    return children
      ? Children.map(children, (child, index) => {
          let eventName = `event-${index}`;
          eventElements.current[eventName] = {
            detailPages: child.props.children,
            animations: { loading: {}, standard: {} },
            expandedHeight: child.props.expandedHeight
          };
          return cloneElement(child, {
            x: index * xFactor,
            width,
            id: index,
            setRef: div => (eventElements.current[eventName].element = div)
          });
        })
      : [];
  }

  console.log("render");

  return (
    <div className="proc-timeline">
      <svg
        className="proc-timeline-svg"
        onClick={eventClick}
        ref={div => (bar = div)}
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        width="900"
        height="80"
      >
        <title>procTrackBar</title>
        {eventDomElements}
      </svg>
      <div className="event-details">{eventPage}</div>
    </div>
  );
}

export default ProcessTimeLineBar;
