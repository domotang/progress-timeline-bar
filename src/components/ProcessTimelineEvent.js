import React from "react";

function ProcessTimelineEvent({ x, width, id, setRef }) {
  return (
    <g>
      <h1>fart</h1>
      <rect
        ref={setRef}
        id={`rect-${id}`}
        x={x + 10.47}
        y="9.5"
        width={width}
        height="67.69"
        rx="6.27"
        fill="#29abe2"
      />
      <circle
        id={`cir-${id}`}
        cx={x + 25.9}
        cy="26.02"
        r="24.9"
        fill="#29abe2"
        stroke="#fff"
        stroke-miterlimit="10"
        stroke-width="2"
      />
    </g>
  );
}
// width="136.18"
export default ProcessTimelineEvent;
