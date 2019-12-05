"use strict";
import React, { useState, useEffect } from "react";

function PTBListBox({ children }) {
  var children2 = children.map((child, i) => {
    return child.type;
  });
  // var [selectedBar, setSelectedBar] = useState(0);
  console.log(children2);
  return { children2 };
}

export default PTBListBox;
