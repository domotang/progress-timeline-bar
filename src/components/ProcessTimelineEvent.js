"use strict";
import React, { useState, useEffect } from "react";

function ProcessTimelineEvent(props) {
  var [mode, setMode] = useState(props.mode);

  useEffect(() => {
    setMode(mode);
  }, [mode]);

  return <props.Event {...props} />;
}
export default ProcessTimelineEvent;

// useEffect(() => {
//   console.log("mounted");
//   return () => console.log("unmounted");
// }, []);
