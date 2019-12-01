"use strict";

function PTBBar(barData, templateAPI) {
  var { open, close } = templateAPI.regBar(barData);
  var barId = barData.barId;

  var publicAPI = {
    getId,
    open,
    close
  };
  return publicAPI;

  function getId() {
    return barId;
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
    getExpandedHeight,
    deregister
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
    setHeader
  };
  return publicAPI;

  function init(mode) {
    templateAPI.init(mode);
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

  function setHeader(state) {
    switch (state) {
      case "detail":
        bar.open();
        break;
      case "closed":
        bar.close();
    }
  }

  function setMode(mode) {
    switch (mode) {
      case "detail":
        templateAPI.setMode("detail");
        break;
      case "large":
        templateAPI.setMode("large");
        break;
      case "small":
        templateAPI.setMode("small");
        break;
    }
  }
}

export { PTBController };
