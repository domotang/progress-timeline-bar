"use strict";
import React from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/src/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

function PTBMaterialTracker(styleOptions, elementCount, status) {
  var xFactor = Math.round(
    (styleOptions.barWidth.large - 10 - (154 + (elementCount - 1) * 0.1)) /
      elementCount
  );
  var xFactor2 = Math.round(
    (styleOptions.barWidth.small - 10 - (154 + (elementCount - 1) * 0.1)) /
      elementCount
  );
  var eventWidth = xFactor - 15,
    eventWidth2 = xFactor2 - 15,
    timelineBarWidth = status > 0 ? 194 + xFactor * (status - 1) : 164,
    timelineBarWidth2 = status > 0 ? 194 + xFactor2 * (status - 1) : 164,
    modes = {
      small: { barHeight: 38 },
      large: { barHeight: 38 },
      detail: { barHeight: 90 }
    },
    bar = {},
    events = [],
    barModeAnimations = null,
    openedElements = { event: null, header: null },
    yHeight = 0;
  var animationSpeed = 1;

  var publicAPI = {
    init,
    getTemplates,
    regBar,
    regEvent,
    setMode,
    closeEvents
  };
  console.log(timelineBarWidth2);
  return publicAPI;

  //*************component registrations*****************

  function regBar({ element }) {
    var controlNodes = {
      barElement: element.querySelector(".proc-timeline-svg"),
      tag: element.querySelector(".header-bar"),
      events: element.querySelector(".events"),
      title: element.querySelector(".title"),
      detail: element.querySelector(".detail"),
      eventDetails: element.querySelector(".event-details"),
      backButton: element.querySelector(".back-icon"),
      upButton: element.querySelector(".up-icon")
    };

    var animation = null;

    var internalBarAPI = {
      getHeaderState,
      getNodes,
      open,
      close
    };

    bar = internalBarAPI;

    function open(onResolve) {
      yHeight = 100;
      animation = generateBarDetailAniTimeline(onResolve);
      if (!openedElements.event) {
        _updateBarHeight(
          (openedElements.event
            ? openedElements.event.getExpandedHeight()
            : 0) +
            90 +
            yHeight,
          0.3,
          0.24
        );
      }

      animation.timeScale(animationSpeed);
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

    function getHeaderState() {
      return animation ? (animation.time() ? true : false) : false;
    }
  }

  function regEvent(event, type, id) {
    var currentExpandedHeight = 0;
    var controlNodes = {
      event,
      tag: event.querySelector(".tag"),
      title: event.querySelector(".title"),
      date: event.querySelector(".date"),
      icon: event.querySelector(".icon"),
      iconGroup: event.querySelector(".icon-group"),
      iconShape: event.querySelector(".icon-shape"),
      iconSvg: event.querySelector(".icon-svg")
    };

    var internalEventAPI = {
      getNodes,
      close,
      getExpandedHeight,
      id
    };

    events.push(internalEventAPI);

    var animation = null;

    var eventAPI = {
      open,
      deregister
    };
    return eventAPI;

    function open(expandedHeight, onResolve) {
      if (openedElements.event) openedElements.event.close();
      openedElements.event = internalEventAPI;
      if (!bar.getHeaderState()) bar.open();
      _updateBarHeight(expandedHeight + 130 + yHeight, 0.3, 0);

      let { x, y, width } = event.getBBox();
      var upCoords = { x: width / 2 + x - 40, y: y + 90 };

      currentExpandedHeight = expandedHeight;
      animation =
        type === "loading"
          ? generateEventLoadingAniTimeline(controlNodes)
          : type === "standard"
          ? generateEventStandardAniTlOpen(controlNodes, expandedHeight)
          : null;
      if (onResolve) {
        animation.vars.onComplete = () => {
          _updateEventBackButton(true, upCoords);
          onResolve();
        };
      }
      animation.timeScale(animationSpeed);
      animation.play();
    }

    function close(onResolve) {
      if (onResolve) {
        animation.vars.onReverseComplete = () => {
          onResolve();
        };
      }
      _updateEventBackButton(false);
      animation.reverse();
      openedElements.event = null;
    }

    function getNodes() {
      return controlNodes;
    }

    function getExpandedHeight() {
      return currentExpandedHeight;
    }
    function deregister() {
      events = events.filter(event => event.id != id);
    }
  }
  //*************public methods*****************

  function setMode(mode, onResolve) {
    switch (mode) {
      case "small":
        _setModeSmall(onResolve);
        break;
      case "large":
        _setModeLarge(onResolve);
        break;
      case "detail":
        _setModeDetail(onResolve);
        break;
      case "modal":
        _setModeModal(onResolve);
        break;
    }
  }

  function init(mode) {
    barModeAnimations = generateBarAniTimeline();
    barModeAnimations.seek(mode);
    _updateBarHeight(modes[mode].barHeight, 0);
    gsap.to(bar.getNodes().barElement, 0, {
      attr: {
        visibility: 1
      }
    });
  }

  function getTemplates() {
    return {
      bar: _getBarTmplt(),
      event: _getEventTmplt(),
      barHeights: _getBarHeights()
    };
  }

  function closeEvents() {
    if (openedElements.event) openedElements.event.close();
    _updateBarHeight(
      (openedElements.event ? openedElements.event.getExpandedHeight() : 0) +
        90 +
        yHeight,
      0.3,
      0.24
    );
  }

  //*************local methods*****************

  function _setModeLarge() {
    if (openedElements.event) openedElements.event.close();
    if (openedElements.header) openedElements.header.close();
    changeMode();

    function changeMode() {
      yHeight = 0;
      _updateBarHeight(modes["large"].barHeight, 0.3);
      barModeAnimations.timeScale(animationSpeed);
      barModeAnimations.tweenTo("large");
    }
  }

  function _setModeSmall() {
    if (openedElements.event) openedElements.event.close();
    if (openedElements.header) openedElements.header.close();

    changeMode();
    function changeMode() {
      yHeight = 0;
      _updateBarHeight(modes["small"].barHeight, 0.3);
      barModeAnimations.timeScale(animationSpeed);
      barModeAnimations.tweenTo("small");
    }
  }

  function _setModeDetail(onResolve) {
    // if (!openedElements.event) onResolve();
    _updateBarHeight(
      modes["detail"].barHeight,
      0.3,
      0.2,
      onResolve
      // openedElements.event ? onResolve : null
    );

    if (openedElements.event) openedElements.event.close();
    if (openedElements.header) openedElements.header.close();
    changeMode();

    function changeMode() {
      barModeAnimations.timeScale(animationSpeed);
      barModeAnimations.tweenTo("detail");
    }
  }

  function _setModeModal(onResolve) {
    if (!bar.getHeaderState()) bar.open(onResolve);
  }

  function _getEventsNodesByType() {
    var allNodesByType = {
      event: [],
      tag: [],
      title: [],
      date: [],
      icon: [],
      iconGroup: [],
      iconShape: [],
      iconSvg: []
    };

    for (var i = 0; i < events.length; i++) {
      let currentEventNodes = events[i].getNodes();
      for (let node in currentEventNodes) {
        allNodesByType[node].push(currentEventNodes[node]);
      }
    }
    return allNodesByType;
  }

  function _getBarHeights() {
    var modeHeights = {};
    for (let mode in modes) {
      modeHeights = { ...modeHeights, [mode]: modes[mode].barHeight };
    }
    return modeHeights;
  }

  function _updateEventBackButton(active, coords) {
    console.log(coords);
    var upButton = bar.getNodes().upButton;

    if (active) {
      var tl = gsap.timeline({ paused: true });

      tl.add("set");

      tl.to(
        upButton,
        0,
        {
          attr: {
            visibility: 0,
            opacity: 0
          }
        },
        "set"
      );

      tl.to(
        upButton,
        0,
        {
          attr: {
            x: coords.x,
            y: coords.y + 60
          }
        },
        "set"
      );

      tl.add("move");

      tl.to(
        upButton,
        0.4,
        {
          attr: {
            visibility: 1,
            opacity: 1
          }
        },
        "move"
      );

      tl.to(
        upButton,
        0.2,
        {
          attr: {
            x: coords.x,
            y: coords.y
          }
        },
        "move"
      );

      tl.play();
    } else {
      gsap.to(
        upButton,
        0.2,
        {
          attr: {
            visibility: 0,
            opacity: 0
          }
        },
        "set"
      );
    }
  }

  function _updateBarHeight(height, speed, delay, onResolve) {
    gsap.to(
      bar.getNodes().barElement,
      typeof speed !== "undefined" ? speed / (animationSpeed * 1.3) : 0.3,
      {
        delay: delay ? delay : 0,
        attr: {
          height: height
        },
        height: height,
        onComplete: onResolve,
        ease: "Linear.easeNone"
      }
    );
  }

  //*************component templates*****************

  function _getBarTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      return (
        <svg
          className="proc-timeline-svg"
          id="tool-bar"
          xmlns="http://www.w3.org/2000/svg"
          width={styleOptions.barWidth.large}
          height="90"
          visibility="hidden"
          display="block"
        >
          <g
            className="top-element-node"
            id={`bar`}
            onClick={props.currentMode === "detail" ? props.barClick : null}
            cursor={props.currentMode === "detail" ? "pointer" : "default"}
          >
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
              fill={styleOptions.fontColor}
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
              fill={styleOptions.fontColor}
            >
              {props.detail}
            </text>
          </g>
          <svg
            className="back-icon"
            x="0"
            y="48"
            visibility="hidden"
            onClick={props.currentMode === "modal" ? props.backClick : null}
            cursor={props.currentMode === "modal" ? "pointer" : "default"}
          >
            <g className="back-group">
              <path
                className="back-shape"
                opacity="0"
                id={`cir-${props.id}`}
                // d="M0,20 a20,20,0,0,1,40,0 a20,20,0,0,1,-40,0"
                d="M0,00 h30 v90 h-30 v-90"
                transform="translate(2,2)"
                fill="#4a75a1"
                stroke={styleOptions.backgroundColor}
                strokeMiterlimit="10"
                strokeWidth="0"
              ></path>
              <svg
                stroke="currentColor"
                fill={styleOptions.fontColor}
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="icon-svg"
                x="0"
                y="8"
                fontSize="28"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167
                239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4
                9.4-24.6 0-33.9L217.9 256z"
                ></path>
              </svg>
            </g>
          </svg>
          <svg
            className="up-icon"
            x="30"
            y="68"
            visibility="hidden"
            onClick={props.closeEventsClick}
            cursor="pointer"
          >
            <g className="up-group">
              <path
                className="up-shape"
                opacity="0"
                id={`cir-${props.id}`}
                // d="M0,20 a20,20,0,0,1,40,0 a20,20,0,0,1,-40,0"
                // transform="translate(2,2)"
                d="M0,20 h70 v70 h-70 v-70"
                transform="translate(2,2)"
                fill="#4a75a1"
                stroke={styleOptions.backgroundColor}
                strokeMiterlimit="10"
                strokeWidth="0"
              ></path>
              <svg
                stroke="currentColor"
                fill="white"
                strokeWidth="0"
                viewBox="0 0 512 512"
                className="icon-svg"
                x="28"
                y="56"
                fontSize="28"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273
                167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4
                24.6 9.4 33.9 0l127.1-127z"
                ></path>
              </svg>
            </g>
          </svg>
          <g className="events">{props.eventDomElements}</g>
        </svg>
      );
    };
  }

  function _getEventTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      var x = props.id * xFactor;
      var Icon = props.icon;

      return (
        <g
          className="top-element-node"
          id={`event-${props.id}`}
          ref={props.setRef}
          cursor={
            props.currentMode != "large" && !props.opened
              ? "pointer"
              : "default"
          }
          onClick={() => {
            if (props.currentMode != "large" && !props.opened) {
              props.eventClick(props.id);
            }
          }}
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
            fill={styleOptions.fontColor}
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
            fill={styleOptions.fontColor}
          >
            {props.date}
          </text>
          <svg className="icon" x={x + 132} y="8">
            <g className="icon-group">
              <path
                className="icon-shape"
                id={`cir-${props.id}`}
                d="M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0"
                transform="translate(2,2)"
                fill={
                  props.isOnStatus
                    ? styleOptions.eventOnStatusColor
                    : props.isCompleted
                    ? styleOptions.eventCompletedColor
                    : props.color
                }
                stroke={styleOptions.backgroundColor}
                style={{ strokeOpacity: 1 }}
                strokeMiterlimit="10"
                strokeWidth="2"
              ></path>
              <Icon
                className="icon-svg"
                fill={styleOptions.fontColor}
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
    var { tag, title, icon } = controleNodes;
    var tl = gsap.timeline({ paused: true });
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
    tl.to(icon, 0.2, { scale: 0.8, ease: "Expo.easeOut" }, "loader");
    tl.to(tag, 0.2, { scale: 1, ease: "Expo.easeOut" }, "loader");

    tl.add("spin");

    tl.to(
      tag,
      1.6,
      { rotation: 600, transformOrigin: "40, 28", ease: "Power0.easeOut" },
      "spin"
    );

    tl.add("spread");
    tl.to(tag, 0, { rotation: 0, transformOrigin: "40, 28" }, "spread");
    tl.to(tag, 0.3, {
      x: 20,
      y: 88,
      fill: "#e3e3e3",
      morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
      ease: "Expo.easeOut"
    }),
      "spread";
    tl.to(
      icon,
      0.3,
      {
        ease: "Expo.easeOut",
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
    var { event, tag, title, date, icon, iconGroup } = controleNodes;

    var tl = gsap.timeline({ paused: true });
    // animate event
    tl.add("shrink");
    tl.to([title, date], 0.1, { opacity: 0 }, "shrink", "start");
    tl.to(event, 0.1, {
      transformOrigin: "50% 50%",
      scale: 0.8,
      ease: "Power1.easeInOut"
    }),
      "shrink";
    tl.to(event, 0.3, { y: 86, ease: "Power1.easeInOut" }, 0.1, "shrink");
    tl.add("spread");
    tl.to(tag, 0.2, {
      x: "20",
      y: "85",
      opacity: 0.6,
      fill: styleOptions.placeholderColor,
      morphSVG: `M10,10 h${styleOptions.barWidth.large -
        80} a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-${styleOptions
        .barWidth.large -
        80} a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
      ease: "Power1.easeInOut"
    }),
      "spread";
    tl.to(
      iconGroup,
      0.2,
      {
        attr: {
          scale: 2
        },
        scale: 2,
        ease: "Power1.easeInOut"
      },
      "spread"
    );
    tl.to(
      icon,
      0.2,
      {
        attr: {
          x: 0,
          y: 80,
          scale: 2,
          transformOrigin: "left-top"
        },
        ease: "Power1.easeInOut"
      },
      "spread"
    );
    tl.to(
      event,
      0.2,
      { x: "0", y: "0", scale: 1, ease: "Power1.easeInOut" },
      "spread"
    );

    return tl;
  }

  function generateBarDetailAniTimeline(onResolve) {
    var { backButton, tag: barTag, events, eventDetails } = bar.getNodes();

    var tl = gsap.timeline({ paused: true });

    tl.add("widen");
    tl.to(
      barTag,
      0.2,
      {
        morphSVG: `M0,0 h${styleOptions.barWidth.large -
          100} a6,6,0,0,1,6,5 v13 h-${styleOptions.barWidth.large -
          262} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`
      },
      "widen"
    );

    tl.add("grow");
    if (onResolve) {
      tl.call(onResolve);
    }
    tl.to(
      barTag,
      0.3,
      {
        opacity: 0.8,
        morphSVG: `M0,0 h${styleOptions.barWidth.large -
          100} a6,6,0,0,1,6,5 v${100 + 13} h-${styleOptions.barWidth.large -
          262} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-${100 +
          76} a6,6,0,0,1,6,-6`,
        ease: "Power1.easeInOut"
      },
      "grow"
    );
    tl.to(
      [events, eventDetails],
      0.3,
      { y: 100, ease: "Power1.easeInOut" },
      "grow"
    );
    tl.add("final");
    tl.to(
      backButton,
      0.2,
      {
        attr: {
          visibility: 1,
          opacity: 1
        }
      },
      "-=.1",
      "final"
    );

    return tl;
  }

  function generateBarAniTimeline() {
    var { barElement, tag: barTag, events, title, detail } = bar.getNodes();
    var eventNodes = _getEventsNodesByType();

    var tl = gsap.timeline({ paused: true });

    tl.add("detail");
    tl.add("shrink");
    tl.to(eventNodes.date, 0.2, { opacity: 0 }, "shrink");
    tl.to(
      eventNodes.iconGroup,
      0.3,
      { scale: 0.3, x: "+=17", y: "+=14", ease: "Power3.inOut" },
      "shrink"
    );
    tl.to(
      eventNodes.iconShape,
      0.3,
      { fill: styleOptions.placeholderColor, strokeWidth: 0 },
      "shrink"
    );
    tl.to(eventNodes.iconSvg, 0.3, { opacity: 0 }, "shrink");
    tl.to(title, 0.3, { opacity: 0 }, "shrink");
    tl.to(detail, 0.3, { y: "-=15" }, "shrink");
    tl.to(
      barTag,
      0.3,
      {
        morphSVG: `M0,0 h${timelineBarWidth} a6,6,0,0,1,6,5 l1, 1 h-${timelineBarWidth -
          146} a8,8,0,0,0,-7,7 l-7, 18 a8,8,0,0,1,-6,6 h-127 a6,6,0,0,1,-6,-6 v-25 a6,6,0,0,1,6,-6`,
        ease: "Power3.inOut"
      },
      "shrink"
    );
    tl.to(
      eventNodes.tag.slice(status),
      0.3,
      { fill: styleOptions.placeholderColor },
      "shrink"
    );
    tl.to(
      eventNodes.tag[0],
      0.3,
      {
        morphSVG: {
          shape: `M11,1 h${eventWidth +
            5} l0, 0 l-5, 12 l-5, 12 l0, 0 h-${eventWidth +
            5} a6,6,0,0,1,-6,-6 l2 -6 l3 -6 a6,6,0,0,1,6,-6`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    );
    tl.to(
      eventNodes.tag.slice(1, eventNodes.tag.length - 1),
      0.3,
      {
        morphSVG: {
          shape: `M4,1 h${eventWidth + 12} l-5, 12 l-5, 12 h-${eventWidth +
            12} l5, -12 l5, -12`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    );
    tl.to(
      eventNodes.tag[eventNodes.tag.length - 1],
      0.3,
      {
        morphSVG: {
          shape: `M-1,1 h${eventWidth +
            5} a6,6,0,0,1,6,6 l-2, 6 l-3, 6 a6,6,0,0,1,-6,6 h-${eventWidth +
            5}  l0, 0 l5, -12 l5, -12 l0, 0`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    );
    tl.to(eventNodes.event, 0.3, { x: "+=4", y: "-=13" }, "shrink");
    tl.to(eventNodes.title, 0.2, { opacity: 0 }, "shrink");
    tl.to(
      eventNodes.date,
      0.3,
      { x: "-=10", y: "-=13", fontSize: 12 },
      "shrink"
    );
    tl.to(eventNodes.date, 0.02, { opacity: 1 });
    tl.add("large");
    tl.add("shrink2");
    tl.to(
      barTag,
      0.3,
      {
        morphSVG: `M0,0 h${timelineBarWidth2 -
          50} a6,6,0,0,1,6,5 l1, 1 h-${timelineBarWidth2 -
          146} a8,8,0,0,0,-7,7 l-7, 18 a8,8,0,0,1,-6,6 h-77 a6,6,0,0,1,-6,-6 v-25 a6,6,0,0,1,6,-6`,
        ease: "Power3.inOut"
      },
      "shrink2"
    );
    tl.to(
      eventNodes.tag[0],
      0.3,
      {
        x: 94,
        morphSVG: {
          shape: `M11,1 h${eventWidth +
            5} l0, 0 l-5, 12 l-5, 12 l0, 0 h-${eventWidth +
            5} a6,6,0,0,1,-6,-6 l2 -6 l3 -6 a6,6,0,0,1,6,-6`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink2"
    );
    tl.add("small");

    return tl;
  }
}

export default PTBMaterialTracker;
