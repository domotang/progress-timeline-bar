"use strict";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable);
gsap.globalTimeline.timeScale(1);
console.log(gsap.version);

//*************component public animations*****************
export function BarAniTl({
  eventNodes,
  barNodes,
  styleOptions,
  elementCount,
  status,
  smallMode,
  largeMode
}) {
  var { barDiv, barElement, tag: barTag, title, detail } = barNodes;
  var tl = gsap.timeline({ paused: true });

  tl.add("detail")
    .add("shrink")
    .to(eventNodes.masked, 0.1, { clipPath: "none" }, "shrink")
    .to(eventNodes.date, 0.2, { opacity: 0 }, "shrink")
    .to(
      barElement,
      0.3,
      { height: largeMode.bar.height, ease: "none" },
      "shrink"
    )
    .to(
      eventNodes.iconShape,
      0.3,
      { fill: styleOptions.placeholderColor, strokeWidth: 0 },
      "shrink"
    )
    .to(eventNodes.iconSvg, 0.3, { opacity: 0 }, "shrink")
    .to(title, 0.3, { opacity: 0 }, "shrink")
    .to(detail, 0.3, { y: "-=15" }, "shrink")
    .to(
      barTag,
      0.3,
      {
        morphSVG: `M0,0 h${
          largeMode.bar.width
        } a6,6,0,0,1,6,5 l1, 1 h-${largeMode.bar.width -
          146} a8,8,0,0,0,-7,7 l-7, 18 a8,8,0,0,1,-6,6 h-127 a6,6,0,0,1,-6,-6 v-25 a6,6,0,0,1,6,-6`,
        ease: "Power3.inOut"
      },
      "shrink"
    );
  if (eventNodes.tag.length != status) {
    tl.to(
      eventNodes.tag.slice(status),
      0.3,
      { fill: styleOptions.placeholderColor },
      "shrink"
    );
  }

  eventNodes.tag.reduce(_tagNodeLargeReducer, tl);
  eventNodes.iconGroup.reduce(_iconGroupNodeLargeReducer, tl);
  eventNodes.date.reduce(_dateNodeLargeReducer, tl);

  tl.to(
    eventNodes.tag[0],
    0.3,
    {
      morphSVG: {
        shape: `M12,1 h${largeMode.event.width +
          5} h0 h0 h0 l-5, 12 l-5, 12 h0 h-${largeMode.event.width +
          5} a6,6,0,0,1,-6,-6 l2 -6 l3 -6 a6,6,0,0,1,6,-6`,
        shapeIndex: 0,
        map: "complexity"
      },
      ease: "Power3.inOut"
    },
    "shrink"
  )
    .to(
      eventNodes.tag.slice(1, eventNodes.tag.length - 1),
      0.3,
      {
        morphSVG: {
          shape: `M5,1 h${largeMode.event.width +
            12} h0 h0 h0 l-5, 12 l-5, 12 h0 h-${largeMode.event.width +
            12} h0 l5, -12 l5, -12 h0`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    )
    .to(
      eventNodes.tag[eventNodes.tag.length - 1],
      0.3,
      {
        morphSVG: {
          shape: `M0,1 h${largeMode.event.width +
            5} h0 h0 a6,6,0,0,1,6,6 l-2, 6 l-3, 6 a6,6,0,0,1,-6,6 h-${largeMode
            .event.width + 5}  h0 l5, -12 l5, -12 h0`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    )
    .to(eventNodes.event, 0.3, { x: "+=4", y: "-=13" }, "shrink")
    .to(eventNodes.title, 0.2, { opacity: 0 }, "shrink")
    .to(eventNodes.date, 0.02, { opacity: 1 })
    .add("large")
    .add("shrink2")
    .to(
      barElement,
      0.3,
      {
        height: smallMode.bar.height,
        ease: "none"
      },
      "shrink2"
    )
    .to(
      barDiv,
      0.3,
      {
        padding: "3px",
        width: styleOptions.barWidth.small,
        ease: "none"
      },
      "shrink2"
    )
    .to(
      barTag,
      0.3,
      {
        morphSVG: `M-5,0 h${smallMode.bar.width -
          80} l-2, 2 l-1, 1 h-${smallMode.bar.width -
          176} l-2, 6 l-3, 6 h-2 h-75 a3,3,0,0,1,-3,-3 v-9 a3,3,0,0,1,3,-3`,
        ease: "Power3.inOut"
      },
      "shrink2"
    );

  let eventNodesAniActions = eventNodes.tag.map((node, index) => {
    return function nodeAniAction() {
      tl.to(
        node,
        0.3,
        {
          x: index * smallMode.event.xFactor + 80,
          y: 17,
          morphSVG: {
            shape:
              index < status - 1
                ? `M6,0 h${smallMode.event.width +
                    6} h0 h0 h0 l-5, 11 v0 h-${smallMode.event.width +
                    6} h0 l5 -11 v0 h0`
                : index === status - 1 && index !== elementCount - 1
                ? `M6,0 h18 l7,-7 h${smallMode.event.width -
                    16} h0 l-8, 18 v0 h-${smallMode.event.width +
                    6} h0 l4 -12 v0 h0`
                : index === elementCount - 1 && index != status - 1
                ? `M7,-4 h${smallMode.event.width +
                    2} h0 h0 a3,3,0,0,1,3,3 v5 v4 a3,3,0,0,1,-3,3 h-${smallMode
                    .event.width + 8} h0 l8 -17 v0 h0`
                : index === elementCount - 1 && index === status - 1
                ? `M6,0 h18 l4,-4 h${smallMode.event.width -
                    19} a3,3,0,0,1,3,3 v5 v4 a3,3,0,0,1,-3,3 h-${smallMode.event
                    .width + 8} h0 l5 -11 v0 h0`
                : `M8,-4 h${smallMode.event.width +
                    6} h0 h0 h0 l-7, 16 v0 h-${smallMode.event.width +
                    6} h0 l7 -16 v0 h0`
          },
          ease: "Power3.inOut"
        },
        "shrink2"
      ).to(
        eventNodes.date[index],
        0.3,
        { x: index * smallMode.event.xFactor + 86, y: 29, scale: 0.45 },
        "shrink2"
      );
    };
  });

  tl.to(eventNodes.iconGroup, 0.3, { opacity: 0, scale: 0 }, "shrink2");

  eventNodesAniActions.forEach(nodeAniAction => {
    nodeAniAction();
  });

  tl.to(detail, 0.3, { x: -6, y: -18, scale: 0.5 }, "shrink2");
  tl.add("small");

  return tl;

  function _tagNodeLargeReducer(accum, cur, index) {
    return accum.to(
      cur,
      0.3,
      { x: index * largeMode.event.xFactor + 143 },
      "shrink"
    );
  }
  function _iconGroupNodeLargeReducer(accum, cur, index) {
    return accum.to(
      cur,
      0.3,
      {
        scale: 0.3,
        x: index * largeMode.event.xFactor + 148,
        y: "+=17"
      },
      "shrink"
    );
  }
  function _dateNodeLargeReducer(accum, cur, index) {
    return accum.to(
      cur,
      0.3,
      { x: index * largeMode.event.xFactor + 167, y: 36 },
      "shrink"
    );
  }
}

export function BarModalDetailTl({
  nodes,
  styleOptions,
  eventDrop,
  barTop,
  height,
  barHeight
}) {
  var tl = gsap.timeline({ paused: true });

  tl.add(_barModalLockTl(nodes.barDiv), "move");
  if (eventDrop) {
    tl.add("move");
  } else {
    tl.add("widen")
      .add(_barDetailWidenTl(nodes.tag, styleOptions), "widen")
      .add("move");
  }
  tl.add(_barPositionTl(nodes.barDiv, barTop), "move")
    .add(() => {
      if (!tl.reversed()) _barHeightTween(nodes.barElement, height);
    }, "move+=.01")
    .add(() => {
      if (tl.reversed()) _barHeightTween(nodes.barElement, barHeight);
    }, "move+=.2")
    .add(_barDetailAniTl(nodes, styleOptions), "move");

  return tl;
}

export function BarModalSmallTl({
  nodes,
  styleOptions,
  barTop,
  height,
  barHeight,
  barModeAnimations
}) {
  var tl = gsap.timeline({ paused: true });

  tl.add("start")
    .add(_barModalLockTl(nodes.barDiv), "start")
    .add(barModeAnimations.tweenTo("detail", { overwrite: true }), "start")
    .add(_barPositionTl(nodes.barDiv, barTop), "start")
    .add("move")
    .add(() => {
      if (!tl.reversed()) _barHeightTween(nodes.barElement, height);
    }, "move")
    .add(() => {
      if (tl.reversed()) _barHeightTween(nodes.barElement, barHeight);
    }, "move+=.1")
    .add(_barDetailAniTl(nodes, styleOptions), "move");

  return tl;
}

export function EventOpenTl({
  type,
  controlNodes,
  expandedHeight,
  barHeight,
  upCoords,
  scrollOffset,
  scrollIconOffset,
  styleOptions,
  onResolve
}) {
  var tl = gsap.timeline({ paused: true });

  tl.add("start")
    .add(() => {
      if (!tl.reversed()) _barHeightTween(controlNodes.barElement, barHeight);
    }, "start")
    .add(
      _eventStandardAniOpenTl({
        controlNodes,
        expandedHeight,
        styleOptions,
        scrollOffset,
        scrollIconOffset,
        onResolve
      }),
      "start"
    )
    .add(() => {
      if (!tl.reversed()) {
        _updateEventOpenUpButtonTl(
          controlNodes.upButton,
          upCoords,
          controlNodes.upButtonClip
        );
      }
    }, "start+=.4")
    .add(() => {
      if (tl.reversed()) {
        _updateEventCloseUpButtonTween(controlNodes.upButton);
      }
    }, "start+=.8");

  return tl;
}

export function EventsCloseTl({ nodes, height, eventClose }) {
  var tl = gsap.timeline({ paused: true });

  tl.add("start")
    .add(() => eventClose(), "start")
    .add(() => _barHeightTween(nodes.barElement, height), "start+=.4");

  return tl;
}

export function initElementsTween({
  barNodes,
  mode,
  containerHeight,
  styleOptions
}) {
  gsap.set(barNodes.barContainer, {
    marginTop: mode === "small" ? "3px" : "10px",
    height: containerHeight,
    position: "relative",
    marginLeft: "10px"
  });
  gsap.set(barNodes.barDiv, {
    backgroundColor: styleOptions.backgroundColor,
    padding: "5px",
    width: styleOptions.barWidth.large,
    borderRadius: "5px",
    position: "relative",
    zIndex: 0
  });
  gsap.set(barNodes.headerDetails, {
    top: 10,
    left: 170,
    opacity: 0,
    position: "absolute"
  });
  gsap.set(barNodes.eventDetails, {
    top: 100,
    left: 150,
    opacity: 0,
    position: "absolute"
  });
  gsap.set(barNodes.upButton, {
    opacity: 0
  });
}

export function containerTween({ barContainer, height, marginTop }) {
  gsap.to(
    barContainer,
    0.3,
    {
      height: height,
      marginTop: marginTop,
      ease: "none"
    },
    "shrink"
  );
}

export function showBarTween({ barElement }) {
  gsap.set(barElement, {
    attr: {
      visibility: "visible"
    }
  });
}

export function EventScrollAni({
  eventNodes,
  upButton,
  scrollDiv,
  visibleEventsWidth,
  xFactor
}) {
  var draggable = null;
  var dragAni = null;
  var eventMoveStore = null;
  var iconMoveStore = null;
  var iconVanishStore = null;
  var curId = null;
  var curEventScrollPos = null;
  var lastEventScrollPos = null;
  var scrollLength = Math.abs(
    Math.ceil(visibleEventsWidth - xFactor * eventNodes.tagMove.length)
  );

  return {
    create,
    kill,
    updateEvent,
    scrollPosHasMoved,
    scrollOffset
  };

  function create() {
    gsap.set(scrollDiv, { clearProps: "x,y" });

    Draggable.create(scrollDiv, {
      throwResistance: 0,
      maxDuration: 1,
      trigger: eventNodes.event,
      type: "x",
      inertia: true,
      bounds: {
        minX: -scrollLength,
        maxX: 0
      },
      zIndexBoost: false,
      snap: value => Math.round(value / xFactor) * xFactor,
      onDrag: _updateScrollTarget,
      onThrowUpdate: _updateScrollTarget
    });

    draggable = Draggable.get(scrollDiv);

    var opts = {
      scrollLength,
      xFactor,
      eventMoveNode: eventNodes.tagMove,
      iconVanishNodes: eventNodes.iconGroup,
      iconMoveNodes: eventNodes.iconMove
    };
    dragAni = _eventDragTl(opts);

    function _updateScrollTarget() {
      // console.log(draggable.x);
      dragAni.progress(this.x / -scrollLength);
    }
  }

  function updateEvent(id, animation) {
    var nodeBegin = 0;
    var nodeEnd = 0;
    if (draggable) curEventScrollPos = draggable.x;

    if (id === null) {
      if (dragAni.getById("upButton"))
        dragAni.remove(dragAni.getById("upButton"));
      if (eventMoveStore) dragAni.add(eventMoveStore, `shrink`);
      if (iconMoveStore) dragAni.add(iconMoveStore, "shrink");
      if (iconVanishStore)
        dragAni.add(iconVanishStore, `shrink+=${xFactor * curId + 20}`);
      if (animation) {
        dragAni.progress(lastEventScrollPos / -scrollLength);
        animation.seek(0).pause();
        nodeBegin = eventNodes.iconGroup[curId].getBoundingClientRect().x;
        dragAni.progress(curEventScrollPos / -scrollLength);
        nodeEnd = eventNodes.iconGroup[curId].getBoundingClientRect().x;
      }
    } else {
      dragAni.remove((eventMoveStore = dragAni.getById(`eventMove-${id}`)));
      dragAni.remove((iconMoveStore = dragAni.getById(`iconMove-${id}`)));
      iconVanishStore = dragAni.getById(`iconVanish-${id}`);
      if (iconVanishStore) dragAni.remove(iconVanishStore);
      let upButtonMove = id * xFactor + xFactor / 2 + 100;
      dragAni.fromTo(
        upButton,
        { x: upButtonMove },
        {
          duration: scrollLength,
          x: `${upButtonMove - scrollLength}`,
          ease: "none",
          id: "upButton"
        },
        "shrink"
      );
      lastEventScrollPos = draggable.x;
    }
    curId = id;

    return Math.abs(
      nodeBegin - nodeEnd + (curEventScrollPos - lastEventScrollPos)
    );
  }

  function kill() {
    return new Promise(resolve => {
      draggable.kill();
      draggable = null;

      if (dragAni.progress()) {
        gsap.to(dragAni, 0.2, {
          progress: 0,
          onComplete: () => {
            resolve();
          }
        });
      } else resolve();
    });
  }

  function scrollPosHasMoved() {
    return draggable ? draggable.x != curEventScrollPos : false;
  }

  function scrollOffset() {
    return Math.abs(draggable.x);
  }
}

//*************component private animations*****************

// function _eventLoadingAniTl({ controleNodes, expandedHeight }) {
//   var { tag, title, icon } = controleNodes;
//   var tl = gsap.timeline({ paused: true });
//   //animate event
//   tl.add("shrink");
//   tl.to(title, 0.1, { opacity: 0 }, "shrink");
//   tl.to(tag, 0.3, {
//     x: "+=58",
//     y: "+=20",
//     morphSVG: "M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0",
//     scale: 0.8,
//     transformOrigin: "40, 28"
//   }),
//     "shrink";
//   tl.to(
//     icon,
//     0.3,
//     { x: "+=64", y: "+=20", transformOrigin: "40, 28" },
//     "shrink"
//   );

//   tl.add("center");
//   tl.to(icon, 0.2, { x: 420, y: 189 }, "center");
//   tl.to(tag, 0.2, { x: 408, y: 186, scale: 0.4 }, "center");

//   tl.add("loader");
//   tl.to(tag, 0, {
//     morphSVG:
//       "M0,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M60,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M30,62 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0",
//     scale: 0.2
//   }),
//     "loader";
//   tl.to(icon, 0.2, { scale: 0.8, ease: "Expo.easeOut" }, "loader");
//   tl.to(tag, 0.2, { scale: 1, ease: "Expo.easeOut" }, "loader");

//   tl.add("spin");

//   tl.to(
//     tag,
//     1.6,
//     { rotation: 600, transformOrigin: "40, 28", ease: "Power0.easeOut" },
//     "spin"
//   );

//   tl.add("spread");
//   tl.to(tag, 0, { rotation: 0, transformOrigin: "40, 28" }, "spread");
//   tl.to(tag, 0.3, {
//     x: 20,
//     y: 88,
//     fill: "#e3e3e3",
//     morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
//     ease: "Expo.easeOut"
//   }),
//     "spread";
//   tl.to(
//     icon,
//     0.3,
//     {
//       ease: "Expo.easeOut",
//       x: -8,
//       y: 76,
//       scale: 2,
//       transformOrigin: "left-top"
//     },
//     "spread"
//   );

//   return tl;
// }

function _eventStandardAniOpenTl({
  controlNodes,
  expandedHeight,
  styleOptions,
  scrollOffset,
  scrollIconOffset,
  onResolve
}) {
  var {
    event,
    masked,
    eventDetails,
    tag,
    title,
    date,
    iconGroup
  } = controlNodes;

  var tl = gsap.timeline();
  // animate event
  tl.add("shrink")
    .to(masked, 0.1, { clipPath: "none" })
    .to([title, date], 0.1, { opacity: 0 }, "shrink", "start")
    .to(
      event,
      0.1,
      {
        transformOrigin: "50% 50%",
        scale: 0.8,
        ease: "Power1.easeInOut"
      },
      "shrink"
    )
    .to(event, 0.3, { y: "86", ease: "Power1.easeInOut" }, 0.1, "shrink")
    .add(onResolve)
    .add("spread")
    .to(
      tag,
      0.2,
      {
        x: `${scrollOffset + 20}`,
        y: "85",
        opacity: 0.6,
        fill: styleOptions.placeholderColor,
        morphSVG: `M10,10 h${styleOptions.barWidth.large -
          80} h0 h0 a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-${styleOptions
          .barWidth.large -
          80} a6,6,0,0,1,-6,-6 v-${expandedHeight} a6,6,0,0,1,6,-6`,
        ease: "Power1.easeInOut"
      },
      "spread"
    )
    .to(
      iconGroup,
      0.2,
      {
        x: `${scrollIconOffset + 4}`,
        y: 80,
        scale: 2,
        transformOrigin: "top left",
        ease: "Power1.easeInOut"
      },
      "spread"
    )
    .to(
      event,
      0.2,
      { x: "0", y: "0", scale: 1, ease: "Power1.easeInOut" },
      "spread"
    )
    .to(eventDetails, 0.2, { opacity: 1 }, 0.6, "spread");

  return tl;
}

function _updateEventOpenUpButtonTl(upButton, coords, upButtonClip) {
  var tl = gsap.timeline();

  tl.add("set")
    .to(
      upButton,
      0.01,
      {
        opacity: 0
      },
      "set"
    )
    .to(
      upButton,
      0,
      {
        x: coords.x
      },
      "set"
    )
    .to(
      upButtonClip,
      0,
      {
        y: coords.y + 30
      },
      "set"
    )
    .add("move")
    .to(
      upButton,
      0.4,
      {
        opacity: 1
      },
      "move"
    )
    .to(
      upButtonClip,
      0.2,
      {
        y: coords.y
      },
      "move"
    );
  return tl;
}

function _updateEventCloseUpButtonTween(upButton) {
  gsap.to(
    upButton,
    0.2,
    {
      opacity: 0
    },
    "set"
  );
}

function _barPositionTl(barDiv, top) {
  var tl = gsap.timeline();

  tl.add("start").to(
    barDiv,
    0.6,
    {
      x: 20,
      y: `-=${top - 10}`,
      backgroundColor: "rgba(211, 232, 235, 0.7)",
      padding: "5px"
    },
    "start"
  );

  // tl.vars.onComplete = () => console.log("bar play");
  // tl.vars.onReverseComplete = () => console.log("bar reverse");

  return tl;
}

function _barHeightTween(node, height) {
  gsap.to(node, 0.2, {
    attr: {
      height: height
    },
    height: height,
    ease: "none"
  });
}

function _barModalLockTl(barDiv) {
  var tl = gsap.timeline();

  // tl.to(barDiv, 0, {
  //   zIndex: 0
  // })
  tl.add("start").to(
    barDiv,
    0.01,
    {
      zIndex: 100
    },
    "start"
  );

  // tl.vars.onComplete = () => console.log("zind play");
  // tl.vars.onReverseComplete = () => console.log("zind reverse");

  return tl;
}

function _barDetailWidenTl(tag, styleOptions) {
  var tl = gsap.timeline();

  tl.add("widen").to(
    tag,
    0.2,
    {
      morphSVG: `M0,0 h${styleOptions.barWidth.large -
        100} a6,6,0,0,1,6,5 v13 h-${styleOptions.barWidth.large -
        262} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`
    },
    "widen"
  );

  return tl;
}

function _barDetailAniTl(nodes, styleOptions) {
  var tl = gsap.timeline();

  tl.add("grow")
    .to(
      nodes.tag,
      0.3,
      {
        opacity: 0.8,
        morphSVG: `M0,0 h${styleOptions.barWidth.large -
          100} a6,6,0,0,1,6,5 v${100 + 13} h-${styleOptions.barWidth.large -
          262} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-${100 +
          76} a6,6,0,0,1,6,-6`,
        ease: "Power1.easeInOut"
      },
      "grow"
    )
    .to(
      [nodes.events, nodes.eventDetails],
      0.3,
      { y: 100, ease: "Power1.easeInOut" },
      "grow"
    )
    .add("final")
    .to(
      nodes.backButton,
      0.2,
      {
        attr: {
          visibility: 1,
          opacity: 1
        }
      },
      "-=.1",
      "final"
    )
    .to(nodes.headerDetails, 0.3, { opacity: 1 }, "final");

  return tl;
}
function _eventDragTl({
  scrollLength,
  xFactor,
  eventMoveNode,
  iconVanishNodes,
  iconMoveNodes
}) {
  var tl = gsap.timeline({ paused: true }).add("shrink");

  eventMoveNode.reduce(_eventMoveReducer, tl);
  iconMoveNodes.reduce(_iconMoveReducer, tl);
  iconVanishNodes.reduce(_iconVanishReducer, tl);

  function _eventMoveReducer(accum, cur, index) {
    return accum.to(
      cur,
      scrollLength,
      { x: -scrollLength, ease: "none", id: `eventMove-${index}` },
      "shrink"
    );
  }

  function _iconMoveReducer(accum, cur, index) {
    let nodebecomesHidden = xFactor * index < scrollLength;
    return accum.to(
      cur,
      nodebecomesHidden ? xFactor * index : scrollLength,
      {
        x: nodebecomesHidden ? -xFactor * index : -scrollLength,
        ease: "none",
        id: `iconMove-${index}`
      },
      "shrink"
    );
  }

  function _iconVanishReducer(accum, cur, index) {
    return xFactor * index < scrollLength
      ? accum.to(
          cur,
          30,
          {
            scale: 0,
            transformOrigin: "center",
            ease: "none",
            id: `iconVanish-${index}`
          },
          xFactor * index + 20,
          "shrink"
        )
      : accum;
  }
  return tl;
}
