import React from "react";

import { MdAlarm } from "react-icons/md";

function ProcessTimelineEvent({ x, width, id, setRef, title, color, icon }) {
  return (
    <g id={`event-${id}`} ref={setRef} cursor="pointer">
      <path
        className="tag"
        id={`rect-${id}`}
        d={`M0,0 h${width} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${width} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
        transform={`translate(${x + 156}, 20)`}
        fill={color}
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
        {title}
      </text>
      <path
        className="icon"
        id={`cir-${id}`}
        d="M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0"
        transform={`translate(${x + 140}, 10)`}
        fill={color}
        stroke="#fff"
        strokeMiterlimit="10"
        strokeWidth="2"
      />

      {/* <path
        className="iconSvg"
        fill="white"
        x={x + 151}
        y="21"
        d={icon}
        transform="scale(.05) translate(340, 10)"
      /> */}
    </g>
  );
}
export default ProcessTimelineEvent;
