"use strict";
import React, { useState, useEffect } from "react";

function ProcessTimelineEvent(props) {
  var [mode, setMode] = useState(props.mode);

  useEffect(() => {
    console.log("mounted");
    return () => console.log("unmounted");
  }, []);

  useEffect(() => {
    setMode(mode);
    console.log("help");
  }, [mode]);

  console.log("render event top", props.id);
  return <props.PTBEvent {...props} />;
}
export default ProcessTimelineEvent;
