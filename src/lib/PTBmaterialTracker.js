"use strict";
import React from "react";
import { TimelineLite, TweenLite, Expo, Power0 } from "gsap/TweenMax";
import { morphSVG } from "../lib/MorphSVGPlugin";

function PTBMaterialTracker(barWidth, elementCount, status) {
  var xFactor = 880 / elementCount;
  var eventWidth = xFactor - 15;
  var timelineBarWidth = status > 0 ? xFactor * status + 48 : 196;
  var bar = {};
  var events = [];
  var animations = {};
  var openedEvent = null;
  var currentState = "detail";
  var xHeight = 200;
  var eventDetailTop = 140;

  //*************component templates*****************

  function getBarTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      return (
        <svg
          className="proc-timeline-svg"
          ref={div => props.addBar({ barId: "procBar", element: div })}
          id="tool-bar"
          xmlns="http://www.w3.org/2000/svg"
          width="1040"
          height="90"
        >
          <g className="top-element-node" id={`bar`}>
            <path
              onClick={props.eventClick}
              className="header-bar"
              id={`rect-`}
              d={`M0,0 h${timelineBarWidth} a6,6,0,0,1,6,5 l5, 13 h-${timelineBarWidth -
                157} a7,7,0,0,0,-7,7 l-20, 57 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`}
              transform={`translate(6, 0)`}
              fill="#4E63C2"
            />
            {status > 0 ? (
              <circle cx={timelineBarWidth + 36} cy="9" r="9" fill="red" />
            ) : null}
            <text
              className="title"
              x="14"
              y="19"
              fontFamily="Verdana"
              fontSize="12"
              fontWeight="bold"
              fill="white"
            >
              {props.title}
            </text>
            <text
              className="detail"
              x="14"
              y="39"
              fontFamily="Verdana"
              fontSize="14"
              fontWeight="bold"
              fill="white"
            >
              {props.detail}
            </text>
            {props.eventDomElements}
          </g>
        </svg>
      );
    };
  }

  function getEventTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      let x = props.id * xFactor;
      let Icon = props.icon;
      return (
        <g
          onClick={props.eventClick}
          className="top-element-node"
          id={`event-${props.id}`}
          ref={props.setRef}
          cursor="pointer"
        >
          <path
            className="tag"
            id={`rect-${props.id}`}
            d={`M0,0 h${eventWidth} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${eventWidth} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
            transform={`translate(${x + 156}, 20)`}
            fill={props.color}
          />
          <text
            className="title"
            x={x + 198}
            y="33"
            fontFamily="Verdana"
            fontSize="12"
            fontWeight="bold"
            fill="white"
          >
            {props.title}
          </text>
          <svg className="icon" x={x + 138} y="8">
            <g className="icon-group">
              <path
                className="iconShape"
                id={`cir-${props.id}`}
                d="M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0"
                transform="translate(2,2)"
                fill={props.color}
                stroke="#fff"
                strokeMiterlimit="10"
                strokeWidth="2"
              ></path>
              <Icon
                className="iconSvg"
                fill="white"
                x="13"
                y="13"
                fontSize="28"
              />
            </g>
          </svg>
        </g>
      );
    };
  }

  //*************component animations*****************

  function generateEventLoadingAniTimeline({ tag, title, icon }) {
    let tl = new TimelineLite({ paused: true });
    //animate event
    tl.add("shrink");
    tl.to(title, 0.1, { opacity: 0 }, "shrink");
    tl.to(tag, 0.3, {
      x: "+=58",
      y: "+=20",
      morphSVG: "M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0",
      scale: 0.8,
      transformOrigin: "40, 28"
    }),
      "shrink";
    tl.to(
      icon,
      0.3,
      { x: "+=64", y: "+=20", transformOrigin: "40, 28" },
      "shrink"
    );

    tl.add("center");
    tl.to(icon, 0.2, { x: 420, y: 189 }, "center");
    tl.to(tag, 0.2, { x: 408, y: 186, scale: 0.4 }, "center");

    tl.add("loader");
    tl.to(tag, 0, {
      morphSVG:
        "M0,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M60,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M30,62 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0",
      scale: 0.2
    }),
      "loader";
    tl.to(icon, 0.2, { scale: 0.8, ease: Expo.easeOut }, "loader");
    tl.to(tag, 0.2, { scale: 1, ease: Expo.easeOut }, "loader");

    tl.add("spin");

    tl.to(
      tag,
      1.6,
      { rotation: 600, transformOrigin: "40, 28", ease: Power0.easeOut },
      "spin"
    );

    tl.add("spread");
    tl.to(tag, 0, { rotation: 0, transformOrigin: "40, 28" }, "spread");
    tl.to(tag, 0.3, {
      x: 20,
      y: 88,
      fill: "#e3e3e3",
      morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${600} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${600} a6,6,0,0,1,6,-6`,
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      icon,
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

  function generateEventStandardAniTimeline({
    event,
    tag,
    title,
    icon,
    iconGroup
  }) {
    let tl = new TimelineLite({ paused: true });
    // animate event
    tl.add("shrink");
    tl.to(title, 0.1, { opacity: 0 }, "shrink", "start");
    tl.to(event, 0.1, {
      x: "+=20",
      y: "+=18",
      scale: 0.7
    }),
      "shrink";
    tl.add("drop");
    tl.to(event, 0.1, { x: "+=6", y: "+=48", ease: Power0.easeOut }, "drop");
    tl.add("spread");
    tl.to(tag, 0.3, {
      x: 20,
      y: 88,
      fill: "#e3e3e3",
      morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      iconGroup,
      0.3,
      {
        attr: {
          scale: 2
        },
        ease: Expo.easeOut,
        scale: 2,
        transformOrigin: "left-top"
      },
      "spread"
    );
    tl.to(
      icon,
      0.3,
      {
        attr: {
          x: 0,
          y: 80,
          scale: 2,
          transformOrigin: "left-top"
        },
        ease: Expo.easeOut
      },
      "spread"
    );
    tl.to(event, 0.3, { x: 0, y: 0, scale: 1 }, "spread");

    return tl;
  }

  function generateBarDetailAniTimeline() {
    var { barElement, tag: barTag } = bar.getNodes();
    var events = getEventsNodes();

    let tl = new TimelineLite({ paused: true });

    tl.add("grow");
    tl.to(
      barTag,
      0.6,
      {
        morphSVG: `M0,0 h1000 a6,6,0,0,1,6,5 v${100 + 13} h-${1000 -
          162} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-${100 +
          76} a6,6,0,0,1,6,-6`,
        ease: Expo.easeOut
      },
      "grow"
    );
    tl.to(barElement, 0.6, { height: 190, ease: Expo.easeOut }, "grow");
    tl.to(events, 0.6, { y: 100, ease: Expo.easeOut }, "grow");

    return tl;
  }

  //*************component registrations*****************

  function regBar(barElement) {
    var controlNodes = {
      barElement,
      tag: barElement.querySelector(".header-bar")
    };

    var internalBarAPI = {
      getNodes
    };

    bar = internalBarAPI;

    function getNodes() {
      return controlNodes;
    }
  }

  function regEvent(event) {
    var controlNodes = {
      event,
      tag: event.querySelector(".tag"),
      title: event.querySelector(".title"),
      icon: event.querySelector(".icon"),
      iconGroup: event.querySelector(".icon-group")
    };

    var animations = [
      {
        id: "loading",
        animation: generateEventLoadingAniTimeline(controlNodes)
      },
      {
        id: "standard",
        animation: generateEventStandardAniTimeline(controlNodes)
      }
    ];

    var internalEventAPI = { getNodes, getAnimations, close };

    events.push(internalEventAPI);

    var eventAPI = {
      open
    };
    return eventAPI;

    function open(type, onResolve) {
      if (openedEvent) openedEvent.close();
      var animation =
        type === "loading"
          ? animations[0].animation
          : type === "standard"
          ? animations[1].animation
          : null;
      if (onResolve) {
        animation.vars.onComplete = () => {
          onResolve.resolve();
        };
      }
      animation.timeScale(1);
      // animation.time(animation.totalDuration());
      animation.play();
      openedEvent = internalEventAPI;
    }

    function close() {
      animations[1].animation.reverse();
    }

    function getNodes() {
      return controlNodes;
    }

    function getAnimations() {
      return animations;
    }
  }

  //*************public methods*****************

  function setState(state) {
    switch (state) {
      case "detail-header":
        setHeaderState();
        break;
    }
    currentState = state;
  }

  function getEventDetailTop() {
    return eventDetailTop;
  }

  function generateAnimations() {
    animations = generateBarDetailAniTimeline();
  }

  //*************local methods*****************

  function setHeaderState() {
    xHeight = 100;
    animations.play();
  }

  function getEventsNodes() {
    return events.map(event => event.getNodes().event);
  }

  var publicAPI = {
    getBarTmplt,
    getEventTmplt,
    regBar,
    regEvent,
    setState,
    generateAnimations,
    getEventDetailTop
  };
  return publicAPI;
}

export default PTBMaterialTracker;
