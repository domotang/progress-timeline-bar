import React from "react";
import ProcessTimelineBar from "./components/ProcessTimelineBar";
import ProcessTimelineBarEvent from "./components/ProcessTimelineEvent";

function App() {
  return (
    <ProcessTimelineBar>
      <ProcessTimelineBarEvent title="opened" />
      <ProcessTimelineBarEvent title="received" />
      <ProcessTimelineBarEvent title="packed" />
      <ProcessTimelineBarEvent title="shipped" />
      <ProcessTimelineBarEvent title="in transit" />
      <ProcessTimelineBarEvent title="arrived destination" />
    </ProcessTimelineBar>
  );
}

export default App;
