"use strict";

function PTBEvent(eventData, templateAPI) {
  var { open } = templateAPI.regEvent(
    eventData.element,
    eventData.type ? eventData.type : "standard"
  );
  var eventId = eventData.eventId,
    detailPages = [eventData.detailPages],
    expandedHeight = parseInt(eventData.expandedHeight);

  var publicAPI = {
    setState,
    getDetailPages,
    getEventId,
    getExpandedHeight
  };
  return publicAPI;

  function getDetailPages() {
    return detailPages;
  }

  function getEventId() {
    return eventId;
  }

  function getExpandedHeight() {
    return expandedHeight;
  }

  function setState(toState, onResolve) {
    switch (toState) {
      case "open":
        open(expandedHeight, onResolve);
        break;
    }
  }
}

function PTBBar(barData, templateAPI) {
  templateAPI.regBar(barData.element);
  var barId = barData.barId,
    element = barData.element,
    animations = null;

  var publicAPI = {
    setState,
    getElement
  };
  return publicAPI;

  function setState() {}

  function getElement() {
    return element;
  }
}

function PTBBuilder(templateAPI) {
  var bar = null,
    events = [],
    currentEvent = null,
    currentMode = "detail";

  var publicAPI = {
    getDetailPages,
    addBar,
    addEvent,
    setEvent,
    setMode,
    getEventDetailTop
  };
  return publicAPI;

  function findEventById(eventId) {
    for (let i = 0; i < events.length; i++) {
      if (eventId == events[i].getEventId()) return events[i];
    }
    return null;
  }

  function addBar(barData) {
    if (!bar) bar = PTBBar(barData, templateAPI);
  }

  function addEvent(eventData) {
    var newEvent = PTBEvent(eventData, templateAPI);
    events.push(newEvent);
  }

  function getDetailPages(eventId) {
    return findEventById(eventId).getDetailPages();
  }

  function getEventDetailTop() {
    return templateAPI.getEventDetailTop();
  }

  function setEvent(eventId) {
    return new Promise(resolve => {
      var event = findEventById(eventId);
      let onResolve = { resolve, currentEvent };
      event.setState("open", onResolve);
      currentEvent = event;
    });
  }

  function setMode(mode) {
    switch (mode) {
      case "detail-header":
        templateAPI.setState("detail-header");
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
}

export { PTBBuilder };
