var tp = $("#target path"),
  marker = $("#marker"),
  corner = $("#corner"),
  close = $("#close path"),
  divide = $("#divider"),
  box = $("#box"),
  boxes = $(".boxes"),
  sent = $(".sent"),
  check = $(".check"),
  coEl = $(".co-element"),
  cont = $(".dialog-text span"),
  button = $(".contact");

TweenMax.set(coEl, {
  opacity: 0,
  visibility: "visible"
});

TweenMax.set(close, {
  drawSVG: "50% 50%",
  opacity: 0
});

TweenMax.set(check, {
  scale: 0,
  visibility: "visible"
});

//animation that's repeated for all of the sections
function revolve() {
  var tl = new TimelineMax({
    repeat: -1
  });

  tl.add("begin");
  tl.staggerFromTo(
    tp,
    2.5,
    {
      scale: 1,
      opacity: 0.7
    },
    {
      scale: 1.2,
      opacity: 0,
      transformOrigin: "50% 50%",
      ease: Expo.easeInOut
    },
    0.2,
    "begin"
  );
  tl.staggerTo(
    tp,
    0.75,
    {
      scale: 1,
      opacity: 0.7
    },
    0.25
  );

  tl.timeScale(1.7);

  return tl;
}
var repeat = revolve();

TweenMax.set(box, {
  visibility: "visible",
  scaleX: 0.19,
  scaleY: 0,
  transformOrigin: "50% 90%"
});

TweenMax.set(corner, {
  visibility: "visible",
  perspective: 600,
  y: -3
});

TweenMax.set(cont, {
  opacity: 0,
  y: -7,
  visibility: "visible"
});

TweenMax.set("#closeback, .boxes, .sent, .message", {
  opacity: 0,
  visibility: "visible"
});

TweenMax.set([button, divide, close], {
  visibility: "visible"
});

TweenMax.set(marker, {
  scaleX: 1
});

function sceneOne() {
  var tl = new TimelineMax({
    paused: true
  });

  tl.add("start");
  tl.staggerFromTo(
    tp,
    0.75,
    {
      scale: 1,
      opacity: 0.8
    },
    {
      scale: 1.6,
      opacity: 0,
      transformOrigin: "50% 50%",
      ease: Circ.easeInOut
    },
    0.08,
    "start"
  );
  tl.to(
    ".map",
    3,
    {
      scale: 1.008,
      transformOrigin: "50% 50%",
      ease: Linear.easeNone
    },
    0.2,
    "start"
  );
  tl.fromTo(
    marker,
    0.7,
    {
      scaleX: 1
    },
    {
      scaleX: 0.62,
      transformOrigin: "50% 50%",
      ease: Sine.easeIn
    },
    "start+=0.05"
  );
  tl.to(
    box,
    0.7,
    {
      scaleY: 0.7,
      transformOrigin: "50% 120%",
      ease: Expo.easeIn
    },
    "start+=0.05"
  );
  tl.to(
    marker,
    0.5,
    {
      scaleX: 0.62,
      transformOrigin: "50% 50%",
      ease: Sine.easeIn
    },
    "start+=1.2"
  );
  tl.to(
    box,
    0.5,
    {
      scale: 1,
      y: 90,
      transformOrigin: "50% 130%",
      ease: Expo.easeOut
    },
    "start+=1"
  );
  tl.fromTo(
    close,
    0.1,
    {
      opacity: 0
    },
    {
      opacity: 1
    },
    "start"
  );
  tl.fromTo(
    corner,
    0.4,
    {
      opacity: 0,
      scale: 1
    },
    {
      opacity: 1,
      scale: 1,
      ease: Sine.easeOut
    },
    "start+=1.4"
  );
  tl.staggerTo(
    cont,
    1,
    {
      y: 0,
      opacity: 1,
      ease: Sine.easeOut
    },
    0.11,
    "start+=1.25"
  );
  tl.fromTo(
    button,
    0.8,
    {
      opacity: 0,
      y: -2
    },
    {
      opacity: 1,
      y: 0,
      ease: Sine.easeOut
    },
    "start+=1.9"
  );
  tl.fromTo(
    divide,
    1,
    {
      scaleX: 0
    },
    {
      scaleX: 1,
      ease: Expo.easeOut
    },
    "start+=2"
  );
  tl.fromTo(
    close,
    1.1,
    {
      drawSVG: "50% 50%"
    },
    {
      drawSVG: true,
      ease: Expo.easeOut
    },
    "start+=2"
  );

  tl.timeScale(1.1);

  return tl;
}
var master = sceneOne();

//contact in
function contact() {
  var tl = new TimelineMax({
    paused: true
  });

  tl.add("over");
  tl.to(
    boxes,
    0.1,
    {
      opacity: 1
    },
    "over"
  );
  tl.to(
    button,
    0.5,
    {
      y: -62,
      x: 78,
      lineHeight: "0.5em",
      ease: Expo.easeOut
    },
    "over"
  );
  tl.staggerTo(
    cont,
    0.5,
    {
      opacity: 0,
      ease: Expo.easeOut
    },
    0.1,
    "over"
  );
  tl.fromTo(
    coEl,
    0.5,
    {
      opacity: 0
    },
    {
      opacity: 1,
      ease: Circ.easeOut
    },
    "over"
  );
  tl.to(
    divide,
    1,
    {
      scaleX: 0,
      ease: Expo.easeOut
    },
    "over"
  );

  //tl.timeScale(1.5);

  return tl;
}
var contactbox = contact();

function submitted() {
  var eB = $(".inCo"),
    subM = $(".submit"),
    tl = new TimelineMax({
      paused: true
    });

  tl.add("done");
  tl.to(
    "label",
    0.5,
    {
      opacity: 0,
      ease: Sine.easeIn
    },
    "done"
  );
  tl.to(
    ".sub",
    0.5,
    {
      opacity: 0,
      ease: Sine.easeIn
    },
    "done"
  );
  tl.to(
    button,
    0.5,
    {
      opacity: 0,
      ease: Sine.easeIn
    },
    "done"
  );
  tl.fromTo(
    eB,
    0.05,
    {
      width: "125px",
      height: "auto",
      padding: "8px 5px 8px 55px",
      opacity: 1,
      x: 0,
      borderRadius: "0"
    },
    {
      width: 20,
      height: 20,
      padding: 0,
      opacity: 0.15,
      x: 60,
      borderRadius: "1000px",
      ease: Circ.easeInOut
    },
    "done+=1"
  );
  tl.to(
    subM,
    0.05,
    {
      width: 20,
      height: 20,
      padding: 0,
      opacity: 0.15,
      x: 60,
      borderRadius: "1000px",
      ease: Circ.easeInOut
    },
    "done+=1"
  );
  tl.to(
    subM,
    0.5,
    {
      opacity: 0.8,
      y: "-=30",
      ease: Circ.easeInOut
    },
    "done+=1.5"
  );
  tl.to(
    eB,
    0.5,
    {
      opacity: 0.8,
      y: "+=30",
      ease: Circ.easeInOut
    },
    "done+=1.5"
  );
  tl.to(
    subM,
    0.5,
    {
      opacity: 0.2,
      y: "+=30",
      ease: Circ.easeInOut
    },
    "done+=2.5"
  );
  tl.to(
    eB,
    0.5,
    {
      opacity: 0.2,
      y: "-=30",
      ease: Circ.easeInOut
    },
    "done+=2.5"
  );
  tl.to(
    subM,
    0.5,
    {
      opacity: 0.8,
      y: "-=30",
      ease: Circ.easeInOut
    },
    "done+=3.5"
  );
  tl.to(
    eB,
    0.5,
    {
      opacity: 0.8,
      y: "+=30",
      ease: Circ.easeInOut
    },
    "done+=3.5"
  );
  tl.to(
    subM,
    0.25,
    {
      opacity: 0.8,
      y: "+=15",
      ease: Circ.easeInOut
    },
    "done+=4.5"
  );
  tl.to(
    eB,
    0.25,
    {
      opacity: 0.8,
      y: "-=15",
      ease: Circ.easeInOut
    },
    "done+=4.5"
  );
  tl.to(
    subM,
    0.5,
    {
      backgroundColor: "#09CA51",
      transformOrigin: "50% 50%",
      scale: 1.75,
      y: "-=70",
      x: "-=23",
      ease: Power3.easeIn
    },
    "done+=5.5"
  );
  tl.to(
    corner,
    0.5,
    {
      opacity: 0,
      scale: 0.9,
      ease: Circ.easeIn
    },
    "done+=5.5"
  );
  tl.to(
    ".email-box",
    0.02,
    {
      opacity: 0,
      ease: Circ.easeIn
    },
    "done+=5.2"
  );
  tl.to(
    eB,
    0.02,
    {
      //makes it prepped for reopening
      opacity: 1
    },
    "done+=5.5"
  );
  tl.fromTo(
    check,
    0.2,
    {
      scale: 0,
      rotation: -30
    },
    {
      scale: 1,
      rotation: 0,
      transformOrigin: "50% 50%",
      ease: Back.easeOut
    },
    "done+=7.1"
  );
  tl.to(
    subM,
    0.05,
    {
      scale: 1.25,
      transformOrigin: "50% 50%",
      ease: Back.easeOut
    },
    "done+=6.65"
  );
  tl.fromTo(
    ".sent",
    0.1,
    {
      opacity: 0
    },
    {
      opacity: 1,
      ease: Sine.easeOut
    },
    "done+=5"
  );
  tl.fromTo(
    ".sent-main",
    0.75,
    {
      opacity: 0
    },
    {
      opacity: 1,
      ease: Sine.easeOut
    },
    "done+=7"
  );
  tl.fromTo(
    ".message",
    0.75,
    {
      opacity: 0
    },
    {
      opacity: 1,
      ease: Sine.easeOut
    },
    "done+=7.1"
  );

  //tl.timeScale(1.1);

  return tl;
}
var complete = submitted();

//contact out
function conOut() {
  var tl = new TimelineMax({
    paused: true
  });

  tl.add("cOut");
  tl.to(
    boxes,
    0.1,
    {
      opacity: 0,
      ease: Expo.easeIn
    },
    "cOut"
  );
  tl.to(
    button,
    0.3,
    {
      opacity: 0,
      ease: Expo.easeIn
    },
    "cOut"
  );
  tl.fromTo(
    close,
    1.1,
    {
      drawSVG: true
    },
    {
      drawSVG: "50% 50%",
      ease: Expo.easeOut
    },
    "cOut"
  );
  tl.to(
    corner,
    0.4,
    {
      opacity: 0,
      scale: 1,
      ease: Sine.easeOut
    },
    "cOut"
  );
  tl.to(
    ".sent",
    0.3,
    {
      opacity: 0,
      ease: Sine.easeOut
    },
    "cOut"
  );
  tl.to(
    close,
    0.4,
    {
      drawSVG: "50% 50%"
    },
    "cOut"
  );
  tl.to(
    check,
    0.4,
    {
      scale: 0,
      transformOrigin: "50% 50%",
      ease: Sine.easeOut
    },
    "cOut"
  );
  tl.to(
    "label",
    0.4,
    {
      scale: 1,
      x: 0,
      opacity: 1
    },
    "cOut"
  );
  tl.to(
    ".map",
    3,
    {
      scale: 1,
      transformOrigin: "50% 50%",
      ease: Linear.easeNone
    },
    "cOut"
  );
  tl.to(
    button,
    0.1,
    {
      x: 0,
      lineHeight: "1"
    },
    "cOut+=1"
  );
  tl.to(
    box,
    1,
    {
      scaleY: 0.8,
      scaleX: 0.19,
      transformOrigin: "50% 0%",
      ease: Expo.easeInOut
    },
    "cOut"
  );
  tl.to(
    "label",
    0.5,
    {
      opacity: 1,
      ease: Sine.easeIn
    },
    "cOut+=1"
  );
  tl.to(
    ".sub",
    0.5,
    {
      opacity: 1,
      ease: Sine.easeIn
    },
    "cOut+=1"
  );
  tl.to(
    ".inCo",
    0.1,
    {
      width: "125px",
      height: "auto",
      padding: "8px 5px 8px 55px",
      opacity: 1,
      x: 0,
      y: 0,
      borderRadius: "0"
    },
    "cOut+=1"
  );
  tl.to(
    ".submit",
    0.1,
    {
      width: "175px",
      height: "auto",
      padding: "8px 5px",
      backgroundColor: "#0083b2",
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      borderRadius: "0"
    },
    "cOut+=1"
  );
  tl.to(
    box,
    0.75,
    {
      scaleX: 0.19,
      scaleY: 0,
      transformOrigin: "50% 90%",
      ease: Expo.easeIn
    },
    "cOut+=1"
  );
  tl.to(
    marker,
    0.5,
    {
      scaleX: 1,
      transformOrigin: "50% 50%",
      ease: Sine.easeIn
    },
    "cOut+=1.5"
  );

  tl.timeScale(2);

  return tl;
}
var contactOut = conOut();

$(document).ready(function() {
  var mt = $(".marker-touch"),
    md = $(".marker-dialog"),
    coBut = $(".button");

  $("#close").on("click", function(e) {
    e.preventDefault();
    $(mt).removeClass("hide");

    if ($(md).hasClass("contactOpen")) {
      $(button).removeClass("hide");
      $(coBut).removeClass("main");
      $(coBut).addClass("button");
      contactOut.restart();
    } else {
      master.reverse();
      master.timeScale(1.8);
    }

    repeat.progress(0);
    TweenMax.set(tp, {
      opacity: 0
    });
    TweenMax.delayedCall(1.6, function() {
      repeat.restart();
    });
    $(md).removeClass("contactOpen");
    $("input[type=email]").val("");
  });

  $(mt).on("click", function(e) {
    e.preventDefault();
    master.restart();
    repeat.pause();
    $(this).addClass("hide");
  });

  $(button).on("click", function(e) {
    e.preventDefault();
    contactbox.restart();
    $(md).addClass("contactOpen");
    $(this).addClass("hide");
    $(this)
      .find(".button")
      .addClass("main");
    $(this)
      .find(".button")
      .removeClass("button");
  });

  $(".email-box input").on("mousenter focus", function(e) {
    e.preventDefault();
    TweenMax.to("label", 0.2, {
      scale: 0.75,
      x: -65,
      opacity: 0.75,
      ease: Sine.easeOut
    });
  });

  $("label").on("click", function(e) {
    e.preventDefault();
    TweenMax.to("label", 0.2, {
      scale: 0.75,
      x: -65,
      opacity: 0.75,
      ease: Sine.easeOut
    });
  });

  $(".submit").on("click", function(e) {
    e.preventDefault();
    $("input[type=email]").val("");
    complete.restart();
  });
});
