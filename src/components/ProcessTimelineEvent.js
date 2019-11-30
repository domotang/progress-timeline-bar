"use strict";
import React, { useState, useEffect } from "react";

function ProcessTimelineEvent(props) {
  var [mode, setMode] = useState(props.mode);

  // useEffect(() => {
  //   props.reRenderEvents.current[props.id] = setMode;
  // });

  useEffect(() => {
    setMode(props.barf.current);
    // console.log("help");
  }, [props.barf.current]);

  // console.log("render event top", props.barf.current);
  return <props.PTBEvent {...props} />;
}
export default ProcessTimelineEvent;
