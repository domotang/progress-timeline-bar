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
    getId,
    getExpandedHeight
  };
  return publicAPI;

  function getDetailPages() {
    return detailPages;
  }

  function getId() {
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
  templateAPI.regBar(barData);
  var barId = barData.barId;

  var publicAPI = {
    getId
  };
  return publicAPI;

  function getId() {
    return barId;
  }
}

function PTBController(templateAPI) {
  var bar = null,
    events = [],
    currentEvent = null,
    currentMode = "detail";

  var publicAPI = {
    init,
    getDetailPages,
    addBar,
    addEvent,
    setEvent,
    setMode
  };
  return publicAPI;

  function init() {
    templateAPI.init();
  }

  function findEventById(eventId) {
    for (let i = 0; i < events.length; i++) {
      if (eventId == events[i].getId()) return events[i];
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
        templateAPI.setState("detail");
        break;
      case "large":
        templateAPI.setState("large");
        break;
      case "small":
        templateAPI.setState("small");
        break;
    }
    currentMode = mode;
  }
}

export { PTBController };
