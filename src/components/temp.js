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


import React from "react";

function ProcessTimelineEvent({ x, width, id, setRef, title }) {
  const eventTag = 


  return (
    <g id={`event-${id}`} ref={setRef}>
      <path
        className="tag"
        id={`rect-${id}`}
        d="M10,10 h132 a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-132 a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6"
        transform={`translate(${x + 6}, -0.7)`}
        fill="#29abe2"
      />
      {/* <rect
        className="tag"
        id={`rect-${id}`}
        x={x + 10.47}
        y="9.5"
        width={width}
        height="67.69"
        rx="6.27"
        fill="#29abe2"
      /> */}
      <text
        className="title"
        x={x + 58}
        y="28"
        fontFamily="Verdana"
        fontSize="14"
        fontWeight="bold"
        fill="blue"
      >
        {title}
      </text>
      <circle
        className="icon"
        id={`cir-${id}`}
        cx={x + 25.9}
        cy="26.02"
        r="24.9"
        fill="#29abe2"
        stroke="#fff"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </g>
  );
}
export default ProcessTimelineEvent;




import { TimelineLite, Expo, Power0 } from "gsap/TweenMax";
import { morphSVG } from "../lib/MorphSVGPlugin";

function generateAniTimeLines(bar, events, setAnimatedTimelines) {
  var aniTimelinesBuild = { events: { loading: {}, standard: {} }, bar };

  for (let i in events) {
    aniTimelinesBuild.events.loading[i] = generateEventLoadingAniTimeline(
      events[i]
    );
    aniTimelinesBuild.events.standard[i] = generateEventStandardAniTimeline(
      events[i]
    );
  }

  aniTimelinesBuild.bar = generateBarAniTimeline(bar);

  setAnimatedTimelines(aniTimelinesBuild);

  function generateEventLoadingAniTimeline(event) {
    var newSelectedEventTag = event.querySelector(".tag");
    var newSelectedEventTitle = event.querySelector(".title");
    var newSelectedEventIcon = event.querySelector(".icon");
    let tl = new TimelineLite({ paused: true });
    //animate event
    tl.add("shrink");
    tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, "shrink");
    tl.to(newSelectedEventTag, 0.3, {
      x: "+=58",
      y: "+=20",
      morphSVG: "M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0",
      scale: 0.8,
      transformOrigin: "40, 28"
    }),
      "shrink";
    tl.to(
      newSelectedEventIcon,
      0.3,
      { x: "+=64", y: "+=20", transformOrigin: "40, 28" },
      "shrink"
    );

    tl.add("center");
    tl.to(newSelectedEventIcon, 0.2, { x: 420, y: 189 }, "center");
    tl.to(newSelectedEventTag, 0.2, { x: 408, y: 186, scale: 0.4 }, "center");

    tl.add("loader");
    tl.to(newSelectedEventTag, 0, {
      morphSVG:
        "M0,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M60,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M30,62 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0",
      scale: 0.2
    }),
      "loader";
    tl.to(
      newSelectedEventIcon,
      0.2,
      { scale: 0.8, ease: Expo.easeOut },
      "loader"
    );
    tl.to(newSelectedEventTag, 0.2, { scale: 1, ease: Expo.easeOut }, "loader");

    tl.add("spin");

    tl.to(
      newSelectedEventTag,
      1.6,
      { rotation: 600, transformOrigin: "40, 28", ease: Power0.easeOut },
      "spin"
    );

    tl.add("spread");
    tl.to(
      newSelectedEventTag,
      0,
      { rotation: 0, transformOrigin: "40, 28" },
      "spread"
    );
    tl.to(newSelectedEventTag, 0.3, {
      x: 20,
      y: 88,
      morphSVG:
        "M10,10 h840 a6,6,0,0,1,6,6 v280 a6,6,0,0,1,-6,6 h-840 a6,6,0,0,1,-6,-6 v-280 a6,6,0,0,1,6,-6",
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      newSelectedEventIcon,
      0.3,
      {
        ease: Expo.easeOut,
        x: -8,
        y: 76,
        scale: 2,
        transformOrigin: "left-top"
      },
      "spread"
    );

    return tl;
  }

  function generateEventStandardAniTimeline(event) {
    var newSelectedEventTag = event.querySelector(".tag");
    var newSelectedEventTitle = event.querySelector(".title");
    var newSelectedEventIcon = event.querySelector(".icon");
    let tl = new TimelineLite({ paused: true });
    //animate event
    tl.add("shrink");
    tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, "shrink");
    tl.to(newSelectedEventTag, 0.3, {
      x: "+=16",
      morphSVG:
        "M10,10 h110 a6,6,0,0,1,6,6 v50 a6,6,0,0,1,-6,6 h-110 a6,6,0,0,1,-6,-6 v-50 a6,6,0,0,1,6,-6"
    }),
      "shrink";
    tl.to(
      newSelectedEventIcon,
      0.3,
      { x: "+=15", scale: 0.9, transformOrigin: "center" },
      "shrink"
    );
    tl.add("drop");
    tl.to(
      newSelectedEventTag,
      0.3,
      { x: "+=10", y: "+=88", ease: Power0.easeOut },
      "drop"
    );
    tl.to(
      newSelectedEventIcon,
      0.3,
      { x: "+=10", y: "+=88", ease: Power0.easeOut },
      "drop"
    );
    tl.add("spread");
    tl.to(newSelectedEventTag, 0.3, {
      x: 20,
      y: 88,
      morphSVG:
        "M10,10 h840 a6,6,0,0,1,6,6 v280 a6,6,0,0,1,-6,6 h-840 a6,6,0,0,1,-6,-6 v-280 a6,6,0,0,1,6,-6",
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      newSelectedEventIcon,
      0.3,
      {
        ease: Expo.easeOut,
        x: 0,
        y: 86,
        scale: 2,
        transformOrigin: "left-top"
      },
      "spread"
    );

    return tl;
  }

  function generateBarAniTimeline(bar) {
    let tl = new TimelineLite({ paused: true });
    tl.to(bar, 0.2, { attr: { height: 400 }, height: 400 });

    return tl;
  }
}

export default generateAniTimeLines;
