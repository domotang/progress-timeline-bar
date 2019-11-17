'use strict';
import { TimelineLite, TweenLite, Expo, Power0 } from 'gsap/TweenMax';
import { morphSVG } from '../lib/MorphSVGPlugin';

function GeneratePTBEventAnimations(event) {
  let loading = generateEventLoadingAniTimeline(event);
  let standard = generateEventStandardAniTimeline(event);

  var eventAnimations = [
    { id: 'loading', animation: loading },
    { id: 'standard', animation: standard }
  ];

  return eventAnimations;
}

function generateEventLoadingAniTimeline(event) {
  var newSelectedEventTag = event.element.querySelector('.tag');
  var newSelectedEventTitle = event.element.querySelector('.title');
  var newSelectedEventIcon = event.element.querySelector('.icon');
  let tl = new TimelineLite({ paused: true });
  //animate event
  tl.add('shrink');
  tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, 'shrink');
  tl.to(newSelectedEventTag, 0.3, {
    x: '+=58',
    y: '+=20',
    morphSVG: 'M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0',
    scale: 0.8,
    transformOrigin: '40, 28'
  }),
    'shrink';
  tl.to(
    newSelectedEventIcon,
    0.3,
    { x: '+=64', y: '+=20', transformOrigin: '40, 28' },
    'shrink'
  );

  tl.add('center');
  tl.to(newSelectedEventIcon, 0.2, { x: 420, y: 189 }, 'center');
  tl.to(newSelectedEventTag, 0.2, { x: 408, y: 186, scale: 0.4 }, 'center');

  tl.add('loader');
  tl.to(newSelectedEventTag, 0, {
    morphSVG:
      'M0,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M60,10 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0 M30,62 a10,10,0,0,1,20,0 a10,10,0,0,1,-20,0',
    scale: 0.2
  }),
    'loader';
  tl.to(
    newSelectedEventIcon,
    0.2,
    { scale: 0.8, ease: Expo.easeOut },
    'loader'
  );
  tl.to(newSelectedEventTag, 0.2, { scale: 1, ease: Expo.easeOut }, 'loader');

  tl.add('spin');

  tl.to(
    newSelectedEventTag,
    1.6,
    { rotation: 600, transformOrigin: '40, 28', ease: Power0.easeOut },
    'spin'
  );

  tl.add('spread');
  tl.to(
    newSelectedEventTag,
    0,
    { rotation: 0, transformOrigin: '40, 28' },
    'spread'
  );
  tl.to(newSelectedEventTag, 0.3, {
    x: 20,
    y: 88,
    fill: '#e3e3e3',
    morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${event.expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${event.expandedHeight} a6,6,0,0,1,6,-6`,
    ease: Expo.easeOut
  }),
    'spread';
  tl.to(
    newSelectedEventIcon,
    0.3,
    {
      ease: Expo.easeOut,
      x: -8,
      y: 76,
      scale: 2,
      transformOrigin: 'left-top'
    },
    'spread'
  );

  return tl;
}

function generateEventStandardAniTimeline(event) {
  var newSelectedEventTag = event.element.querySelector('.tag');
  var newSelectedEventTitle = event.element.querySelector('.title');
  var newSelectedEventIcon = event.element.querySelector('.icon');
  var newSelectedEventIconGroup = event.element.querySelector('.icon-group');

  let tl = new TimelineLite({ paused: true });
  // animate event
  tl.add('shrink');
  tl.to(newSelectedEventTitle, 0.1, { opacity: 0 }, 'shrink', 'start');
  tl.to(event.element, 0.1, {
    x: '+=20',
    y: '+=18',
    scale: 0.7
  }),
    'shrink';
  tl.add('drop');
  tl.to(
    event.element,
    0.1,
    { x: '+=6', y: '+=48', ease: Power0.easeOut },
    'drop'
  );
  tl.add('spread');
  tl.to(newSelectedEventTag, 0.3, {
    x: 20,
    y: 88,
    fill: '#e3e3e3',
    morphSVG: `M10,10 h990 a6,6,0,0,1,6,6 v${event.expandedHeight} a6,6,0,0,1,-6,6 h-990 a6,6,0,0,1,-6,-6 v-${event.expandedHeight} a6,6,0,0,1,6,-6`,
    ease: Expo.easeOut
  }),
    'spread';
  tl.to(
    newSelectedEventIconGroup,
    0.3,
    {
      attr: {
        scale: 2
      },
      ease: Expo.easeOut,
      scale: 2,
      transformOrigin: 'left-top'
    },
    'spread'
  );
  tl.to(
    newSelectedEventIcon,
    0.3,
    {
      attr: {
        x: 0,
        y: 80,
        scale: 2,
        transformOrigin: 'left-top'
      },
      ease: Expo.easeOut
    },
    'spread'
  );
  tl.to(event.element, 0.3, { x: 0, y: 0, scale: 1 }, 'spread');

  return tl;
}

function generateBarAniTimeline(bar, events) {
  var barTag = bar.querySelector('.header-bar');

  let tl = new TimelineLite({ paused: true });

  tl.add('grow');
  tl.to(
    barTag,
    0.6,
    {
      morphSVG: `M0,0 h1000 a6,6,0,0,1,6,5 v${100 + 13} h-${1000 -
        162} a6,6,0,0,0,-6,6 l-21, 58 a6,6,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-${100 +
        76} a6,6,0,0,1,6,-6`,
      ease: Expo.easeOut
    },
    'grow'
  );
  tl.to(bar, 0.6, { height: 190, ease: Expo.easeOut }, 'grow');
  tl.to(events, 0.6, { y: 100, ease: Expo.easeOut }, 'grow');

  return tl;
}

function animate(animation, toState, onResolve) {
  if (onResolve) {
    animation.vars.onComplete = () => {
      onResolve.resolve();
    };
  }
  animation.timeScale(1);
  // animation.time(animation.totalDuration());
  switch (toState) {
    case 'open':
      animation.play();
      break;
    case 'close':
      animation.reverse();
      break;
  }
}

function animateBar(bar, expandedHeight) {
  TweenLite.to(bar, 0.3, {
    attr: {
      height: expandedHeight + 130
    },
    height: expandedHeight + 130
  });
}

function animateState(animation, toState, onResolve) {
  if (onResolve) {
    animation.vars.onComplete = () => {
      onResolve.resolve();
    };
  }
  animation.timeScale(1);

  switch (toState) {
    case 'detail-header':
      animation.play();
      break;
    case 'detail':
      animation.reverse();
      break;
  }
}

export {
  GeneratePTBEventAnimations,
  generateBarAniTimeline,
  animate,
  animateBar,
  animateState
};
