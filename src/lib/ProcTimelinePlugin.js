import { TimelineLite, TweenLite, Expo, Power0 } from "gsap/TweenMax";
import { morphSVG } from "../lib/MorphSVGPlugin";

function generateAniTimeLines(bar, eventElements) {
  for (let i in eventElements) {
    eventElements[i].animations.loading = generateEventLoadingAniTimeline(
      eventElements[i]
    );
    eventElements[i].animations.standard = generateEventStandardAniTimeline(
      eventElements[i]
    );
  }

  eventElements.bar = generateBarAniTimeline(bar);

  function generateEventLoadingAniTimeline(eventElement) {
    var newSelectedEventTag = eventElement.element.querySelector(".tag");
    var newSelectedEventTitle = eventElement.element.querySelector(".title");
    var newSelectedEventIcon = eventElement.element.querySelector(".icon");
    let tl = new TimelineLite({ paused: true });
    //animate event
    tl.add("shrink");
    tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, "shrink");
    tl.to(newSelectedEventTag, 0.3, {
      x: "+=58",
      y: "+=20",
      morphSVG: "M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0",
      scale: 0.8,
      transformOrigin: "40, 28"
    }),
      "shrink";
    tl.to(
      newSelectedEventIcon,
      0.3,
      { x: "+=64", y: "+=20", transformOrigin: "40, 28" },
      "shrink"
    );

    tl.add("center");
    tl.to(newSelectedEventIcon, 0.2, { x: 420, y: 189 }, "center");
    tl.to(newSelectedEventTag, 0.2, { x: 408, y: 186, scale: 0.4 }, "center");

    tl.add("loader");
    tl.to(newSelectedEventTag, 0, {
      morphSVG:
        "M0,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M60,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M30,62 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0",
      scale: 0.2
    }),
      "loader";
    tl.to(
      newSelectedEventIcon,
      0.2,
      { scale: 0.8, ease: Expo.easeOut },
      "loader"
    );
    tl.to(newSelectedEventTag, 0.2, { scale: 1, ease: Expo.easeOut }, "loader");

    tl.add("spin");

    tl.to(
      newSelectedEventTag,
      1.6,
      { rotation: 600, transformOrigin: "40, 28", ease: Power0.easeOut },
      "spin"
    );

    tl.add("spread");
    tl.to(
      newSelectedEventTag,
      0,
      { rotation: 0, transformOrigin: "40, 28" },
      "spread"
    );
    tl.to(newSelectedEventTag, 0.3, {
      x: 20,
      y: 88,
      fill: "#e3e3e3",
      morphSVG: `M10,10 h840 a6,6,0,0,1,6,6 v${eventElement.expandedHeight} a6,6,0,0,1,-6,6 h-840 a6,6,0,0,1,-6,-6 v-${eventElement.expandedHeight} a6,6,0,0,1,6,-6`,
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      newSelectedEventIcon,
      0.3,
      {
        ease: Expo.easeOut,
        x: -8,
        y: 76,
        scale: 2,
        transformOrigin: "left-top"
      },
      "spread"
    );

    return tl;
  }

  function generateEventStandardAniTimeline(eventElement) {
    var newSelectedEventTag = eventElement.element.querySelector(".tag");
    var newSelectedEventTitle = eventElement.element.querySelector(".title");
    var newSelectedEventIcon = eventElement.element.querySelector(".icon");
    let tl = new TimelineLite({ paused: true });
    //animate event
    tl.add("shrink");
    tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, "shrink");
    tl.to(eventElement.element, 0.3, {
      x: "+=18",
      y: "+=18",
      scale: 0.7
    }),
      "shrink";
    tl.add("drop");
    tl.to(
      eventElement.element,
      0.3,
      { x: "+=10", y: "+=88", ease: Power0.easeOut },
      "drop"
    );
    tl.add("spread");
    tl.to(newSelectedEventTag, 0.3, {
      x: 20,
      y: 88,
      fill: "#e3e3e3",
      morphSVG: `M10,10 h840 a6,6,0,0,1,6,6 v${eventElement.expandedHeight} a6,6,0,0,1,-6,6 h-840 a6,6,0,0,1,-6,-6 v-${eventElement.expandedHeight} a6,6,0,0,1,6,-6`,
      ease: Expo.easeOut
    }),
      "spread";
    tl.to(
      newSelectedEventIcon,
      0.3,
      {
        ease: Expo.easeOut,
        x: 0,
        y: 86,
        scale: 2,
        transformOrigin: "left-top"
      },
      "spread"
    );
    tl.to(eventElement.element, 0.3, { x: 0, y: 0, scale: 1 }, "spread");

    return tl;
  }

  function generateBarAniTimeline(bar) {
    let tl = new TimelineLite({ paused: true });
    tl.to(bar, 0.2, { attr: { height: 400 }, height: 400 });

    return tl;
  }
}

function play(
  eventElements,
  bar,
  currentEvent,
  newSelectedEvent,
  setCurrentEvent,
  setEventPage
) {
  var timeLineClosePromise = () => {
    return new Promise(resolve => {
      eventElements[
        newSelectedEvent
      ].animations.standard.vars.onComplete = () => {
        resolve(true);
      };
      eventElements[newSelectedEvent].animations.standard.play();
      if (currentEvent) {
        eventElements[currentEvent].animations.standard.pause();
        eventElements[currentEvent].animations.standard.reverse();
      }
    });
  };

  TweenLite.to(bar, 0.2, {
    attr: {
      height: parseInt(eventElements[newSelectedEvent].expandedHeight) + 130
    },
    height: parseInt(eventElements[newSelectedEvent].expandedHeight) + 130
  });

  timeLineClosePromise().then(() => {
    setCurrentEvent(newSelectedEvent);
    setEventPage(eventElements[newSelectedEvent].detailPages);
  });
}

var controlAnimation = {
  play
};

export { generateAniTimeLines, controlAnimation };
