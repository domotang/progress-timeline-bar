"use strict";
import React from "react";
import { TimelineLite, TweenLite, Expo, Power0 } from "gsap/TweenMax";
import { morphSVG } from "../lib/MorphSVGPlugin";
import { MdRecentActors } from "react-icons/md";

function PTBMaterialTracker(barWidth, elementCount, status) {
  var xFactor = 880 / elementCount;
  var width = xFactor - 15;
  var timelineBarWidth = status > 0 ? xFactor * status + 48 : 196;

  function getBarTmplt() {
    // eslint-disable-next-line react/display-name
    return props => {
      return (
        <svg
          className="proc-timeline-svg"
          ref={div => props.addBar({ barId: "procBar", element: div })}
          id="tool-bar"
          data-name="proc-timeline-svg"
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
            d={`M0,0 h${width} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${width} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
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
              <props.Icon
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

  var publicAPI = {
    getBarTmplt,
    getEventTmplt
  };
  return publicAPI;
}

export default PTBMaterialTracker;
