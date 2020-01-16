"use strict";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(InertiaPlugin);
gsap.registerPlugin(Draggable);
gsap.globalTimeline.timeScale(0.6);
console.log(gsap.version);

//*************component public animations*****************
export function BarAniTl({
  eventNodes,
  barNodes,
  styleOptions,
  timelineBarWidthLg,
  timelineBarWidthSm,
  eventWidthLg,
  eventWidthSm,
  xFactorSm,
  elementCount,
  status,
  modes
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
      { height: modes.large.barHeight, ease: "none" },
      "shrink"
    )
    .to(
      eventNodes.iconGroup,
      0.3,
      { scale: 0.3, x: "+=17", y: "+=14", ease: "Power3.inOut" },
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
        morphSVG: `M0,0 h${timelineBarWidthLg} a6,6,0,0,1,6,5 l1, 1 h-${timelineBarWidthLg -
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
  tl.to(
    eventNodes.tag[0],
    0.3,
    {
      morphSVG: {
        shape: `M11,1 h${eventWidthLg +
          5} l0, 0 l-5, 12 l-5, 12 l0, 0 h-${eventWidthLg +
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
          shape: `M4,1 h${eventWidthLg + 12} l-5, 12 l-5, 12 h-${eventWidthLg +
            12} l5, -12 l5, -12`,
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
          shape: `M-1,1 h${eventWidthLg +
            5} a6,6,0,0,1,6,6 l-2, 6 l-3, 6 a6,6,0,0,1,-6,6 h-${eventWidthLg +
            5}  l0, 0 l5, -12 l5, -12 l0, 0`,
          shapeIndex: 0,
          map: "complexity"
        },
        ease: "Power3.inOut"
      },
      "shrink"
    )
    .to(eventNodes.event, 0.3, { x: "+=4", y: "-=13" }, "shrink")
    .to(eventNodes.title, 0.2, { opacity: 0 }, "shrink")
    .to(eventNodes.date, 0.3, { x: "-=10", y: "-=13", fontSize: 12 }, "shrink")
    .to(eventNodes.date, 0.02, { opacity: 1 })
    .add("large")
    .add("shrink2")
    .to(
      barElement,
      0.3,
      {
        height: modes.small.barHeight,
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
        morphSVG: `M-5,0 h${timelineBarWidthSm -
          80} l-3, 3 h-${timelineBarWidthSm -
          176} l-5, 12 h-77 a3,3,0,0,1,-3,-3 v-9 a3,3,0,0,1,3,-3`,
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
          x: index * xFactorSm + 80,
          y: 17,
          morphSVG: {
            shape:
              index < status - 1
                ? `M6,0 h${eventWidthSm + 6} l-5, 11 h-${eventWidthSm +
                    6} l5 -11`
                : index === status - 1 && index !== elementCount - 1
                ? `M6,0 h18 l7,-7 h${eventWidthSm -
                    16} l-8, 18 h-${eventWidthSm + 6} l4 -11`
                : index === elementCount - 1 && index != status - 1
                ? `M7,-4 h${eventWidthSm +
                    2} a3,3,0,0,1,3,3 v9 a3,3,0,0,1,-3,3 h-${eventWidthSm +
                    8} l8 -17`
                : index === elementCount - 1 && index === status - 1
                ? `M6,0 h18 l4,-4 h${eventWidthSm -
                    19} a3,3,0,0,1,3,3 v9 a3,3,0,0,1,-3,3 h-${eventWidthSm +
                    8} l5 -11`
                : `M8,-4 h${eventWidthSm + 6} l-7, 16 h-${eventWidthSm +
                    6} l7 -16`,
            shapeIndex: 0,
            map: "complexity"
          },
          ease: "Power3.inOut"
        },
        "shrink2"
      ).to(
        eventNodes.date[index],
        0.3,
        { x: index * xFactorSm + 86, y: 29, scale: 0.45 },
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

  if (eventDrop) {
    tl.add("move");
  } else {
    tl.add("widen")
      .add(_barDetailWidenTl(nodes.tag, styleOptions), "widen")
      .add("move");
  }
  tl.add(_barModalLockTl(nodes.barDiv), "move")
    .add(_barPositionTl(nodes.barDiv, barTop), "move")
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
    .add(barModeAnimations.tweenTo("detail", { overwrite: true }), "start")
    .add(_barPositionTl(nodes.barDiv, barTop), "start")
    .add("move")
    .add(_barModalLockTl(nodes.barDiv), "move")
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
  styleOptions,
  onResolve
}) {
  var tl = gsap.timeline({ paused: true });

  tl.add("start")
    .add(() => {
      if (!tl.reversed()) _barHeightTween(controlNodes.barElement, barHeight);
    }, "start")
    .add(
      _eventStandardAniOpenTl(
        controlNodes,
        expandedHeight,
        styleOptions,
        onResolve
      ),
      "start"
    )
    .add(() => {
      if (!tl.reversed()) {
        _updateEventOpenBackButton(controlNodes.upButton, upCoords);
      }
    }, "start+=.4")
    .add(() => {
      if (tl.reversed()) {
        _updateEventCloseBackButtonTween(controlNodes.upButton);
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
  gsap.to(barElement, 0, {
    attr: {
      visibility: 1
    }
  });
}

export function EventScrollAni({ eventNodes, scrollDiv }) {
  Draggable.create(scrollDiv, {
    trigger: eventNodes.event,
    type: "x",
    throwProps: true,
    inertia: true,
    bounds: { minX: -450, maxX: 0 },
    snap: [-0, -146, -292, -440],
    onDrag: Update,
    onThrowUpdate: Update
  });

  var draggable = Draggable.get(scrollDiv);
  var direction = "left";
  var oldX = 0;

  function Update() {
    direction = oldX > draggable.x ? "left" : "right";
    oldX = draggable.x;
    console.log(draggable.x, direction);
    tl.progress(Math.abs(this.x / 450));
  }
  var tl = gsap.timeline({ paused: true });

  tl.to(
    [eventNodes.move, eventNodes.iconMove],
    { x: "-450", ease: "none" },
    "shrink"
  );
  tl.add(() => {
    if (direction === "left") scaleIconTween(eventNodes.iconGroup, 0);
    else scaleIconTween(eventNodes.iconGroup, 1);
  }, 0.3);

  return { tl, draggable };
}

function scaleIconTween(node, value) {
  // gsap.set(node, { transformOrigin: "center" });
  gsap.to(node, 0.1, {
    scale: value,
    ease: "none"
  });
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

function _eventStandardAniOpenTl(
  controlNodes,
  expandedHeight,
  styleOptions,
  onResolve
) {
  var {
    event,
    masked,
    eventDetails,
    tag,
    title,
    date,
    icon,
    iconGroup
  } = controlNodes;

  var tl = gsap.timeline();
  // animate event
  tl.add("shrink")
    .to(masked, 0, { clipPath: "none" })
    .to([title, date], 0.1, { opacity: 0 }, "shrink", "start")
    .to(
      event,
      0.1,
      {
        transformOrigin: "50% 50%",
        scale: 0.8,
        ease: "Power1.easeInOut",
        onComplete: onResolve
      },
      "shrink"
    )
    .to(event, 0.3, { y: "86", ease: "Power1.easeInOut" }, 0.1, "shrink")
    .add("spread")
    .to(
      tag,
      0.2,
      {
        x: "20",
        y: "85",
        opacity: 0.6,
        fill: styleOptions.placeholderColor,
        morphSVG: `M10,10 h${styleOptions.barWidth.large -
          80} a6,6,0,0,1,6,6 v${expandedHeight} a6,6,0,0,1,-6,6 h-${styleOptions
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
        attr: {
          scale: 2
        },
        scale: 2,
        ease: "Power1.easeInOut"
      },
      "spread"
    )
    .to(
      icon,
      0.2,
      {
        attr: {
          x: 0,
          y: 80,
          scale: 2
        },
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

function _updateEventOpenBackButton(upButton, coords) {
  var tl = gsap.timeline();

  tl.add("set")
    .to(
      upButton,
      0,
      {
        attr: {
          visibility: 0,
          opacity: 0
        }
      },
      "set"
    )
    .to(
      upButton,
      0,
      {
        attr: {
          x: coords.x,
          y: coords.y + 60
        }
      },
      "set"
    )
    .add("move")
    .to(
      upButton,
      0.4,
      {
        attr: {
          visibility: 1,
          opacity: 1
        }
      },
      "move"
    )
    .to(
      upButton,
      0.2,
      {
        attr: {
          x: coords.x,
          y: coords.y
        }
      },
      "move"
    );
  return tl;
}

function _updateEventCloseBackButtonTween(upButton) {
  gsap.to(
    upButton,
    0.2,
    {
      attr: {
        visibility: 0,
        opacity: 0
      }
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

  tl.to(barDiv, 0, {
    zIndex: 0
  })
    .add("start")
    .to(
      barDiv,
      0,
      {
        zIndex: 100
      },
      "start"
    );

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
