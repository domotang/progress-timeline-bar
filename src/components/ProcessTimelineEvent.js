import React from "react";

function ProcessTimelineEvent({ x, width, id, setRef, title, color }) {
  return (
    <g id={`event-${id}`} ref={setRef}>
      <path
        className="tag"
        id={`rect-${id}`}
        d={`M10,10 h${width} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${width} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
        transform={`translate(${x + 6}, 0)`}
        fill={color}
      />
      <text
        className="title"
        x={x + 58}
        y="28"
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
        transform={`translate(${x}, 0)`}
        fill={color}
        stroke="#fff"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </g>
  );
}
export default ProcessTimelineEvent;
