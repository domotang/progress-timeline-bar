"use strict";
import React, { useState, useEffect } from "react";

function ProcessTimelineEvent(props) {
  var [mode, setMode] = useState(props.initMode);

  useEffect(() => {
    console.log("update mode");
    setMode(props.barf.current);
  }, [props.barf.current]);

  console.log("render event");
  return <props.PTBEvent {...props} />;
}
export default ProcessTimelineEvent;
