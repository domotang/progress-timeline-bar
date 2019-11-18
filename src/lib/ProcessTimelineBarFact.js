"use strict";
import {
  GeneratePTBEventAnimations,
  generateBarAniTimeline,
  animate,
  animateBar,
  animateState
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
    getEventId,
    getElement
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

  function getElement() {
    return element;
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
    element = barData.element,
    animations = null;

  var publicAPI = {
    setState,
    clickEvent,
    getElement
  };
  return publicAPI;

  function setState() {}

  function clickEvent(expandedHeight) {
    animateBar(element, expandedHeight);
  }

  function getElement() {
    return element;
  }
}

function PTBBuilder(templateAPI) {
  var bar = null,
    events = [],
    currentEvent = null,
    currentMode = "detail",
    animations = null;

  var publicAPI = {
    getDetailPages,
    addBar,
    addEvent,
    getTimeline,
    setEvent,
    setMode,
    generateAnimations
  };
  return publicAPI;

  function findEventById(eventId) {
    for (let i = 0; i < events.length; i++) {
      if (eventId == events[i].getEventId()) return events[i];
    }
    return null;
  }

  function addBar(barData) {
    if (!bar) bar = PTBBar(barData);
  }

  function addEvent(eventData) {
    var newEvent = PTBEvent(eventData);
    events.push(newEvent);
  }

  function getDetailPages(eventId) {
    return findEventById(eventId).getDetailPages();
  }

  function generateAnimations() {
    var eventElements = events.map(event => {
      return event.getElement();
    });
    console.log(eventElements);
    animations = generateBarAniTimeline(bar.getElement(), eventElements);
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
        animateState(animations, "detail-header");
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
