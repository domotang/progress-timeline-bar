import React, { Children, cloneElement, useState } from "react";
import { TimelineLite, Expo } from "gsap/TweenMax";

function ProcessTimeLineBar({ children }) {
  var events = {};
  var bar = null;
  var tl = new TimelineLite({ paused: true });
  var xFactor = 890 / children.length;
  var width = xFactor - 2;

  var [selectedEvent, setEvent] = useState();

  function animate(newSelectedEvent) {
    var newSelectedEventTag = events[newSelectedEvent].querySelector(".tag");
    var newSelectedEventIcon = events[newSelectedEvent].querySelector(".icon");
    var newSelectedEventTitle = events[newSelectedEvent].querySelector(
      ".title"
    );
    if (selectedEvent) {
      var selectedEventTag = events[selectedEvent].querySelector(".tag");
      var selectedEventIcon = events[selectedEvent].querySelector(".icon");
      var selectedEventTitle = events[selectedEvent].querySelector(".title");
    }

    var newSelectedX = newSelectedEventTag.getAttribute("x");
    var selectedWidth = newSelectedEventTag.getAttribute("width");
    var selectedHeight = newSelectedEventTag.getAttribute("height");

    tl.add("raise");

    if (selectedEventTag) {
      tl.to(
        selectedEventTag,
        0.2,
        {
          x: 0,
          attr: { width: selectedWidth, height: selectedHeight },
          width: selectedWidth,
          height: selectedHeight
        },
        "raise"
      );
      tl.to(selectedEventIcon, 0.2, { x: 0 }, "raise");
      tl.to(selectedEventTag, 0.1, { y: 0 }, "spread");
      tl.to(selectedEventIcon, 0.1, { y: 0, scale: 1 }, "spread");
      tl.to(selectedEventTitle, 0.1, { opacity: 1 }, "spread");
    }

    tl.to(
      newSelectedEventTag,
      0.2,
      { attr: { width: 110 }, width: 110, x: 20, y: 88 },
      "raise"
    );
    tl.to(newSelectedEventIcon, 0.2, { y: 82, x: 20, scale: 0.8 }, "raise");
    tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, "raise");
    tl.to(bar, 0.2, { attr: { height: 400 }, height: 400 }, "raise");

    tl.add("spread");

    tl.to(
      newSelectedEventTag,
      0.5,
      {
        ease: Expo.easeOut,
        height: 300,
        attr: { width: 854, height: 300 },
        width: 854,
        x: -newSelectedX + 20
      },
      "spread"
    );
    tl.to(
      newSelectedEventIcon,
      0.5,
      { ease: Expo.easeOut, x: -newSelectedX + 10.47, scale: 2 },
      "spread"
    );

    setEvent(newSelectedEvent);
  }

  function playAni(e) {
    animate(e.target.parentNode.getAttribute("id"));
    tl.play();
  }

  var processedEvents = children
    ? Children.map(children, (child, index) => {
        let eventName = `event-${index}`;
        return cloneElement(child, {
          x: index * xFactor,
          width,
          id: index,
          setRef: div => (events[eventName] = div)
        });
      })
    : [];
  return (
    <div>
      <svg
        onClick={playAni}
        ref={div => (bar = div)}
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        width="900"
        height="80"
      >
        <title>progTrackBar2</title>
        {processedEvents}
      </svg>
    </div>
  );
}

export default ProcessTimeLineBar;
