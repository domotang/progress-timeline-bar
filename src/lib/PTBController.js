"use strict";

function PTBBar(barData, templateAPI) {
  templateAPI.regBar(barData);

  var publicAPI = {
    getElement
  };
  return publicAPI;

  function getElement() {
    return barData.element;
  }
}

function PTBEvent(eventData, templateAPI) {
  var { open, deregister } = templateAPI.regEvent(
    eventData.element,
    eventData.type ? eventData.type : "standard",
    eventData.eventId
  );
  var eventId = eventData.eventId,
    detailPages = [eventData.detailPages],
    expandedHeight = parseInt(eventData.expandedHeight);

  var publicAPI = {
    setState,
    getDetailPages,
    getId,
    deregister
  };
  return publicAPI;

  function getDetailPages() {
    return detailPages;
  }

  function getId() {
    return eventId;
  }

  function setState(toState, onResolve) {
    switch (toState) {
      case "open":
        open(expandedHeight, onResolve);
        break;
    }
  }
}

function PTBController(templateAPI) {
  var bar = null,
    events = [];

  var publicAPI = {
    init,
    getDetailPages,
    addBar,
    addEvent,
    setEvent,
    setMode,
    getBarElement
  };
  return publicAPI;

  function init(mode) {
    templateAPI.init(mode);
  }

  function getBarElement() {
    return bar ? bar.getElement() : null;
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
    var eventId = eventData.eventId;
    if (eventData.element) {
      var newEvent = PTBEvent(eventData, templateAPI);
      return events.push(newEvent);
    }

    findEventById(eventId).deregister();
    events = events.filter(event => event.getId() != eventId);
  }

  function getDetailPages(eventId) {
    return findEventById(eventId).getDetailPages();
  }

  function setEvent(eventId) {
    return new Promise(resolve => {
      var event = findEventById(eventId);
      event.setState("open", resolve);
    });
  }

  function setMode(mode) {
    return new Promise(resolve => {
      switch (mode) {
        case "modal":
          templateAPI.setMode("modal", resolve);
          break;
        case "detail":
          templateAPI.setMode("detail", resolve);
          break;
        case "large":
          templateAPI.setMode("large", resolve);
          break;
        case "small":
          templateAPI.setMode("small", resolve);
          break;
      }
    });
  }
}

export { PTBController };
