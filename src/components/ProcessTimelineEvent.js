"use strict";
import React from "react";

function ProcessTimelineEvent({
  id,
  setRef,
  title,
  color,
  icon: Icon,
  eventClick,
  PTBEvent
}) {
  return (
    <PTBEvent
      id={id}
      Icon={Icon}
      eventClick={eventClick}
      color={color}
      title={title}
      setRef={setRef}
    />
  );
}
export default ProcessTimelineEvent;
