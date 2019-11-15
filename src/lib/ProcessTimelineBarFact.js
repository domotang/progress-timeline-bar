"use strict";
import {
  GeneratePTBEventAnimations,
  eventClickedAnimate
} from "./processTimelineBarPlugin";

function ProcessTimelineBarBuilder() {
  var procTimelineBar = { bar: {}, events: {} };

  function addBar(bar) {
    let barTemplate = { bar: { element: bar } };
    procTimelineBar = { ...procTimelineBar, ...barTemplate };
  }

  function getBar() {
    return procTimelineBar.bar.element;
  }

  function getEvent(eventName) {
    return procTimelineBar.events[eventName];
  }

  function addEvent(event) {
    let eventAnimations = GeneratePTBEventAnimations(event);

    let eventTemplate = {
      [event.eventName]: {
        element: event.element,
        animations: eventAnimations,
        detailPages: event.detailPages,
        expandedHeight: parseInt(event.expandedHeight)
      }
    };

    procTimelineBar.events = { ...procTimelineBar.events, ...eventTemplate };
  }

  function getTimeline() {
    return procTimelineBar;
  }

  function eventClick(eventName, currentEventName) {
    return new Promise(resolve => {
      let animationParams = {
        selectedEvent: getEvent(eventName).animations.standard,
        currentEvent: currentEventName
          ? getEvent(currentEventName).animations.standard
          : null,
        expandedHeight: getEvent(eventName).expandedHeight,
        bar: getBar(),
        resolve
      };
      eventClickedAnimate(animationParams);
    });
  }

  var publicAPI = {
    addBar,
    getBar,
    addEvent,
    getEvent,
    getTimeline,
    eventClick
  };

  return publicAPI;
}

export { ProcessTimelineBarBuilder };
