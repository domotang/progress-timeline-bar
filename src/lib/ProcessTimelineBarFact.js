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
    setClickState,
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
  }

  function setClickState(toState, onResolve) {
    switch (toState) {
      case "open":
        animate(findAnimationById("standard"), onResolve);
        break;
      case "close":
        animate(findAnimationById("standard"), onResolve);
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
    mode = "detail";

  var publicAPI = {
    getDetailPages,
    addBar,
    addEvent,
    getTimeline,
    eventClick
  };
  return publicAPI;

  function findEventById(eventId) {
    for (let i = 0; i < events.length; i++) {
      if (eventId == events[i].getEventId()) return events[i];
    }
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

  function eventClick(eventId) {
    return new Promise(resolve => {
      var event = findEventById(eventId);
      let onResolve = { resolve, currentEvent };
      event.setClickState("open", onResolve);
      bar.clickEvent(event.getExpandedHeight());
      currentEvent = eventId;
    });
  }

  function getTimeline() {
    return [bar, events];
  }
}

export { PTBBuilder };
