"use strict";
import React, {
  Children,
  cloneElement,
  Fragment,
  useState,
  useRef,
  useEffect
} from "react";

function PTBListBox({ children, mode }) {
  var [selectedBar, setSelectedBar] = useState(0);
  var [modal, setModal] = useState(false);
  var [appendedChild, setAppendedChild] = useState(false);

  const elDiv = useRef(null);

  if (!elDiv.current) {
    elDiv.current = document.createElement("div");
  }

  var modalBlockout = document.getElementById("modal");

  useEffect(() => {
    if (modal) {
      modalBlockout.appendChild(elDiv.current);
      setAppendedChild(true);
    } else if (appendedChild) {
      modalBlockout.removeChild(elDiv.current);
      setAppendedChild(false);
    }
  }, [modal]);

  useEffect(() => {
    setSelectedBar(0);
  }, mode);

  var children2 = children
    ? Children.map(children, (child, index) => {
        return cloneElement(child, {
          listBar: true,
          setSelectedBar,
          setModal,
          mode:
            mode === "small"
              ? "small"
              : selectedBar === index
              ? "detail"
              : "large"
        });
      })
    : [];

  return <Fragment>{children2}</Fragment>;
}

export default PTBListBox;
