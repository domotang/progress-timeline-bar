"use strict";
import React, { Children, cloneElement, Fragment, useState } from "react";

function PTBListBox({ children }) {
  var [selectedBar, setSelectedBar] = useState(0);

  var children2 = children
    ? Children.map(children, (child, index) => {
        return cloneElement(child, {
          listBar: true,
          setSelectedBar,
          mode: selectedBar === index ? "detail" : "large"
        });
      })
    : [];

  // console.log("render listBar");

  return <Fragment>{children2}</Fragment>;
}

export default PTBListBox;
