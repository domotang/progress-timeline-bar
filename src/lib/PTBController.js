"use strict";

function PTBBar(barData, templateAPI) {
  templateAPI.regBar(barData);

  {
    let publicAPI = {
      getElement
    };
    return publicAPI;
  }

  function getElement() {
    return barData.element;
  }
}

function PTBEvent(eventData, templateAPI) {
  var eventId = eventData.eventId,
    detailPages = [eventData.detailPages];

  var { open, deregister } = templateAPI.regEvent(
    eventData.element,
    eventData.type ? eventData.type : "standard",
    eventData.eventId,
    parseInt(eventData.expandedHeight)
  );

  {
    let publicAPI = {
      setState,
      getDetailPages,
      getId,
      deregister
    };
    return publicAPI;
  }

  function getDetailPages() {
    return detailPages;
  }

  function getId() {
    return eventId;
  }

  function setState(toState, opts, onResolve) {
    switch (toState) {
      case "open":
        open(opts, onResolve);
        break;
    }
  }
}

function PTBController(templateAPI) {
  var bar = null,
    events = [];

  {
    let publicAPI = {
      init,
      getDetailPages,
      addBar,
      addEvent,
      setEvent,
      setMode,
      getBarElement,
      closeEvents,
      getStyles,
      Bar: templateAPI.Bar,
      Event: templateAPI.Event
    };
    return publicAPI;
  }

  function init(mode) {
    templateAPI.init(mode);
  }

  function getBarElement() {
    return bar ? bar.getElement() : null;
  }

  function getStyles() {
    return templateAPI.getStyles();
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
      let newEvent = PTBEvent(eventData, templateAPI);
      return events.push(newEvent);
    }

    findEventById(eventId).deregister();
    events = events.filter(event => event.getId() != eventId);
  }

  function getDetailPages(eventId) {
    return findEventById(eventId).getDetailPages();
  }

  function setEvent(eventId, opts) {
    return new Promise(resolve => {
      let event = findEventById(eventId);
      event.setState("open", opts, resolve);
    });
  }

  function closeEvents() {
    templateAPI.closeEvents();
  }

  function setMode(mode, opts) {
    return new Promise(resolve => {
      opts = { ...opts, resolve };
      switch (mode) {
        case "modal":
          templateAPI.setMode("modal", opts);
          break;
        case "detail":
          templateAPI.setMode("detail", opts);
          break;
        case "large":
          templateAPI.setMode("large", opts);
          break;
        case "small":
          templateAPI.setMode("small", opts);
          break;
      }
    });
  }
}

export { PTBController };
