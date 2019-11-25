"use strict";
import React from "react";
import { TimelineLite, TweenLite, Expo, Power0, Power3 } from "gsap/TweenMax";
import { morphSVG } from "../lib/MorphSVGPlugin";

function PTBMaterialTracker(barWidth, elementCount, status) {
  var xFactor = Math.round(
    (barWidth.large - (154 + (elementCount - 1) * 0.1)) / elementCount
  );
  var eventWidth = xFactor - 15;
  var timelineBarWidth = status > 0 ? 194 + xFactor * (status - 1) : 164;
  var modes = {
    small: { barHeight: 38 },
    large: { barHeight: 38 },
    detail: { barHeight: 90 }
  };
  var bar = {};
  var events = [];
  var barModeAnimations = null;
  var openedElements = { event: null, header: null };
  var currentMode = "detail";
  var yHeight = 0;

  var publicAPI = {
    init,
    getBarTmplt,
    getEventTmplt,
    regBar,
    regEvent,
    setMode
  };
  return publicAPI;

  //*************component registrations*****************

  function regBar({ element }) {
    var controlNodes = {
      barElement: element.querySelector(".proc-timeline-svg"),
      tag: element.querySelector(".header-bar"),
      events: element.querySelector(".events"),
      title: element.querySelector(".title"),
      detail: element.querySelector(".detail"),
      eventDetails: element.querySelector(".event-details")
    };
    var animation = null;

    var internalBarAPI = {
      getNodes,
      close
    };

    bar = internalBarAPI;

    var eventAPI = {
      open,
      close
    };
    return eventAPI;

    function open() {
      yHeight = 100;
      animation = generateBarDetailAniTimeline();
      _updateBarHeight(
        (openedElements.event ? openedElements.event.getExpandedHeight() : 0) +
          130 +
          yHeight
      );
      animation.play();
      openedElements.header = internalBarAPI;
    }

    function close(onResolve) {
      if (onResolve) {
        animation.vars.onReverseComplete = () => {
          onResolve();
        };
      }
      animation.reverse();
      openedElements.header = null;
    }

    function getNodes() {
      return controlNodes;
    }
  }

  function regEvent(event, type) {
    var currentExpandedHeight = 0;
    var controlNodes = {
      event,
      tag: event.querySelector(".tag"),
      title: event.querySelector(".title"),
      date: event.querySelector(".date"),
      icon: event.querySelector(".icon"),
      iconGroup: event.querySelector(".icon-group")
    };

    var internalEventAPI = {
      getNodes,
      close,
      getExpandedHeight
    };

    events.push(internalEventAPI);

    var animation = null;

    var eventAPI = {
      open
    };
    return eventAPI;

    function open(expandedHeight, onResolve) {
      _updateBarHeight(expandedHeight + 130 + yHeight);
      currentExpandedHeight = expandedHeight;
      if (openedElements.event) openedElements.event.close();
      animation =
        type === "loading"
          ? generateEventLoadingAniTimeline(controlNodes)
          : type === "standard"
          ? generateEventStandardAniTlOpen(controlNodes, expandedHeight)
          : null;
      if (onResolve) {
        animation.vars.onComplete = () => {
          onResolve.resolve();
        };
      }
      animation.timeScale(1);
      // animation.time(animation.totalDuration());
      animation.play();
      openedElements.event = internalEventAPI;
    }

    function close(onResolve) {
      if (onResolve) {
        animation.vars.onReverseComplete = () => {
          onResolve();
        };
      }
      animation.reverse();
      openedElements.event = null;
    }

    function getNodes() {
      return controlNodes;
    }

    function getExpandedHeight() {
      return currentExpandedHeight;
    }
  }
  //*************public methods*****************

  function setMode(mode) {
    if (mode != currentMode) {
      switch (mode) {
        case "large":
          _setMode();
          break;
        case "detail":
          barModeAnimations.reverse();
          _updateBarHeight(modes["detail"].barHeight);
          break;
      }
      currentMode = mode;
    }
  }

  function init(mode) {
    currentMode = mode;
    barModeAnimations = generateBarAniTimeline();
    barModeAnimations.seek(mode);
    _updateBarHeight(modes[mode].barHeight, 0);
    TweenLite.to(bar.getNodes().barElement, 0.2, {
      attr: {
        visibility: 1
      }
    });
  }

  //*************local methods*****************

  function _setMode() {
    closeEvent()
      .then(closeHeader)
      .then(changeMode);

    function changeMode() {
      yHeight = 0;
      _updateBarHeight(38);
      barModeAnimations.timeScale(1);
      barModeAnimations.play();
    }

    function closeEvent() {
      return new Promise(resolve => {
        if (openedElements.event) return openedElements.event.close(resolve);
        return resolve();
      });
    }
    function closeHeader() {
      return new Promise(resolve => {
        if (openedElements.header) return openedElements.header.close(resolve);
        return resolve();
      });
    }
  }

  function _getEventsNodesByType() {
    var allNodesByType = {
      event: [],
      tag: [],
      title: [],
      date: [],
      icon: [],
      iconGroup: []
    };

    for (var i = 0; i < events.length; i++) {
      let currentEventNodes = events[i].getNodes();
      for (let node in currentEventNodes) {
        allNodesByType[node].push(currentEventNodes[node]);
      }
    }
    return allNodesByType;
  }

  function _updateBarHeight(height, speed) {
    TweenLite.to(
      bar.getNodes().barElement,
      typeof speed !== "undefined" ? speed : 0.3,
      {
        attr: {
          height: height
        },
        height: height
      }
    );
  }

  //*************component templates*****************

  function getBarTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      return (
        <svg
          className="proc-timeline-svg"
          id="tool-bar"
          xmlns="http://www.w3.org/2000/svg"
          width={barWidth.large}
          height="90"
          visibility="hidden"
        >
          <g className="top-element-node" id={`bar`}>
            <path
              className="header-bar"
              id={`rect-`}
              d={`M0,0 h${timelineBarWidth} a6,6,0,0,1,6,5 l5, 13 h-${timelineBarWidth -
                157} a8,8,0,0,0,-7,7 l-20, 57 a8,8,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`}
              transform={`translate(0, 0)`}
              fill="#477578"
            />
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
              y="36"
              fontFamily="Verdana"
              fontSize="15"
              fontWeight="bold"
              fill="white"
            >
              {props.detail}
            </text>
            <g className="events">{props.eventDomElements}</g>
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
          className="top-element-node"
          id={`event-${props.id}`}
          ref={props.setRef}
          cursor="pointer"
        >
          <path
            className="tag"
            id={`rect-${props.id}`}
            d={`M6,0 h${eventWidth} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${eventWidth} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
            transform={`translate(${x + 144}, 20)`}
            fill={props.color}
          />
          <text
            className="title"
            x={x + 190}
            y="33"
            fontFamily="Verdana"
            fontSize="12"
            fontWeight="bold"
            fill="white"
          >
            {props.title}
          </text>
          <text
            className="date"
            x={x + 190}
            y="47"
            fontFamily="Verdana"
            fontSize="9"
            fontWeight="bold"
            fill="white"
          >
            {props.date}
          </text>
          <svg className="icon" x={x + 132} y="8">
            <g className="icon-group">
              <path
                className="iconShape"
                id={`cir-${props.id}`}
                d="M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0"
                transform="translate(2,2)"
                fill={props.isOnStatus ? "#7d2828" : props.color}
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

  function generateEventLoadingAniTimeline(controleNodes, expandedHeight) {
    let { tag, title, icon } = controleNodes;
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
      morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
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

  function generateEventStandardAniTlOpen(controleNodes, expandedHeight) {
    let { event, tag, title, date, icon, iconGroup } = controleNodes;
    let tl = new TimelineLite({ paused: true });
    // animate event
    tl.add("shrink");
    tl.to([title, date], 0.1, { opacity: 0 }, "shrink", "start");
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
      y: "+=65",
      fill: "#ddeced",
      morphSVG: `M10,10 h${barWidth.large -
        50} a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-${barWidth.large -
        50} a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
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
    tl.to(event, 0.3, { x: "-=26", y: "-=66", scale: 1 }, "spread");

    return tl;
  }

  function generateBarDetailAniTimeline() {
    var { barElement, tag: barTag, events, eventDetails } = bar.getNodes();

    let tl = new TimelineLite({ paused: true });

    tl.add("grow");
    tl.to(
      barTag,
      0.6,
      {
        morphSVG: `M0,0 h${barWidth.large - 40} a6,6,0,0,1,6,5 v${100 +
          13} h-${barWidth.large -
          202} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-${100 +
          76} a6,6,0,0,1,6,-6`,
        ease: Expo.easeOut
      },
      "grow"
    );
    // tl.to(barElement, 0.6, { height: 190, ease: Expo.easeOut }, "grow");
    tl.to([events, eventDetails], 0.6, { y: 100, ease: Expo.easeOut }, "grow");

    return tl;
  }

  function generateBarAniTimeline() {
    var { barElement, tag: barTag, events, title, detail } = bar.getNodes();
    var eventNodes = _getEventsNodesByType();

    //   event, tag, title, icon, iconGroup

    let tl = new TimelineLite({ paused: true });

    tl.add("detail");
    tl.add("shrink");
    tl.to(eventNodes.date, 0.2, { opacity: 0 }, "shrink");
    tl.to(
      eventNodes.iconGroup,
      0.3,
      { scale: 0, ease: Power3.inOut },
      "shrink"
    );
    tl.to(title, 0.3, { opacity: 0 }, "shrink");
    tl.to(detail, 0.3, { y: "-=15" }, "shrink");
    tl.to(
      barTag,
      0.3,
      {
        morphSVG: `M0,0 h${timelineBarWidth} a6,6,0,0,1,6,5 h-${timelineBarWidth -
          147} a8,8,0,0,0,-7,7 l-7, 18 a8,8,0,0,1,-6,6 h-127 a6,6,0,0,1,-6,-6 v-24 a6,6,0,0,1,6,-6`,
        ease: Power3.inOut
      },
      "shrink"
    );
    tl.to(eventNodes.tag.slice(status), 0.3, { fill: "#ddeced" }, "shrink");
    tl.to(
      eventNodes.tag,
      0.3,
      {
        morphSVG: `M6,0 h${eventWidth +
          4} a6,6,0,0,1,6,6 l-5, 12 a6,6,0,0,1,-6,6 h-${eventWidth +
          4} a6,6,0,0,1,-6,-6 l5, -12 a6,6,0,0,1,6,-6`,
        ease: Power3.inOut
      },
      "shrink"
    );
    tl.to(eventNodes.event, 0.3, { x: "+=4", y: "-=13" }, "shrink");
    tl.to(eventNodes.title, 0.2, { opacity: 0 }, "shrink");
    tl.to(
      eventNodes.date,
      0.3,
      { x: "-=26", y: "-=13", fontSize: 12 },
      "shrink"
    );
    tl.to(eventNodes.date, 0.02, { opacity: 1 });
    tl.add("large");

    return tl;
  }
}

export default PTBMaterialTracker;
