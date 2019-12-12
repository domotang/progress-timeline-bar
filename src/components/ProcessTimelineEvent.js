"use strict";
import React from "react";

function ProcessTimelineEvent(props) {
  return <props.Event {...props} />;
}
export default ProcessTimelineEvent;

// useEffect(() => {
//   console.log("mounted");
//   return () => console.log("unmounted");
// }, []);
