import React, { Children, cloneElement, useEffect } from "react";
import { TweenMax, Power2, TimelineLite } from "gsap/TweenMax";

function ProcessTimeLineBar({ children }) {
  var events = [];
  var bar = null;
  var tl = new TimelineLite({ paused: true });
  var xFactor = 834 / children.length;
  var width = xFactor - 2;

  useEffect(() => {
    tl.add("raise");
    tl.to(events[3], 0.2, { height: 300, y: 46 }, "raise");
    tl.to(
      [events[1], events[2], events[4], events[5], events[0]],
      0.15,
      { height: 36 },
      "raise"
    );
    tl.to(events[3], 0.1, { width: 831, x: -417 });
    //tl.staggerTo(events, 0.5, { autoAlpha: 1, y: 20 }, 0.1);
  });

  function playAni() {
    tl.play();
  }

  var processedEvents = children
    ? Children.map(children, (child, index) =>
        cloneElement(child, {
          x: index * xFactor,
          width,
          id: index,
          setRef: div => (events[index] = div)
        })
      )
    : [];

  return (
    <svg
      onClick={playAni}
      ref={div => (bar = div)}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="600"
      viewBox="0 0 840.97 77.2"
    >
      <title>progTrackBar2</title>
      {processedEvents}
    </svg>
  );
}

export default ProcessTimeLineBar;
