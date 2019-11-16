"use strict";
import {
  GeneratePTBEventAnimations,
  animate,
  animateBar
} from "./processTimelineBarPlugin";

function PTBEvent(eventData) {
  var eventId = eventData.eventId,
    element = eventData.element,
    animations = GeneratePTBEventAnimations(eventData),
    expandedHeight = parseInt(eventData.expandedHeight),
    detailPages = [eventData.detailPages];

  var publicAPI = {
    setState,
    getExpandedHeight,
    getDetailPages,
    getEventId
  };
  return publicAPI;

  function getDetailPages() {
    return detailPages;
  }

  function getExpandedHeight() {
    return expandedHeight;
  }

  function getEventId() {
    return eventId;
  }

  function findAnimationById(animationId) {
    for (let i = 0; i < animations.length; i++) {
      if (animationId == animations[i].id) return animations[i].animation;
    }
    return null;
  }

  function setState(toState, onResolve) {
    switch (toState) {
      case "open":
        animate(findAnimationById("standard"), "open", onResolve);
        break;
      case "close":
        animate(findAnimationById("standard"), "close");
        break;
    }
  }
}

function PTBBar(barData) {
  var barId = barData.barId,
    element = barData.element;

  var publicAPI = {
    clickEvent
  };
  return publicAPI;

  function clickEvent(expandedHeight) {
    animateBar(element, expandedHeight);
  }
}

function PTBBuilder() {
  var bar = null,
    events = [],
    currentEvent = null,
    currentMode = "detail";

  var publicAPI = {
    getDetailPages,
    addBar,
    addEvent,
    getTimeline,
    setEvent,
    setMode
  };
  return publicAPI;

  function findEventById(eventId) {
    for (let i = 0; i < events.length; i++) {
      if (eventId == events[i].getEventId()) return events[i];
    }
    return null;
  }

  function addBar(barData) {
    bar = PTBBar(barData);
  }

  function addEvent(eventData) {
    var newEvent = PTBEvent(eventData);
    events.push(newEvent);
  }

  function getDetailPages(eventId) {
    return findEventById(eventId).getDetailPages();
  }

  function setEvent(eventId) {
    return new Promise(resolve => {
      var event = findEventById(eventId);
      let onResolve = { resolve, currentEvent };
      if (currentEvent) currentEvent.setState("close");
      event.setState("open", onResolve);
      bar.clickEvent(event.getExpandedHeight());
      currentEvent = event;
    });
  }

  function setMode(mode) {
    switch (mode) {
      case "detail-header":
        // animate(findAnimationById("standard"), "open", onResolve);
        break;
      case "detail":
        // animate(findAnimationById("standard"), "open", onResolve);
        break;
      case "large":
        // animate(findAnimationById("standard"), "close");
        break;
      case "small":
        // animate(findAnimationById("standard"), "close");
        break;
    }
    currentMode = mode;
  }

  function getTimeline() {
    return [bar, events];
  }
}

export { PTBBuilder };
