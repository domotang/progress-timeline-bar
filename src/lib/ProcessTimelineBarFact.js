'use strict';
import { animateBar, animateState } from './processTimelineBarPlugin';

function PTBEvent(eventData, templateAPI) {
  var { open } = templateAPI.regEvent(eventData.element);
  var eventId = eventData.eventId,
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

  function setState(toState, onResolve) {
    switch (toState) {
      case 'open':
        open('standard', onResolve);
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
    currentMode = 'detail',
    animations = null;

  var publicAPI = {
    getDetailPages,
    addBar,
    addEvent,
    setEvent,
    setMode
    // generateAnimations
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

  // function generateAnimations() {
  //   var eventElements = events.map(event => {
  //     return event.getElement();
  //   });
  //   animations = generateBarAniTimeline(bar.getElement(), eventElements);
  // }

  function setEvent(eventId) {
    return new Promise(resolve => {
      var event = findEventById(eventId);
      let onResolve = { resolve, currentEvent };
      event.setState('open', onResolve);
      bar.clickEvent(event.getExpandedHeight());
      currentEvent = event;
    });
  }

  function setMode(mode) {
    switch (mode) {
      case 'detail-header':
        templateAPI.setState('detail-header');
        break;
      case 'detail':
        // animate(findAnimationById("standard"), "open", onResolve);
        break;
      case 'large':
        // animate(findAnimationById("standard"), "close");
        break;
      case 'small':
        // animate(findAnimationById("standard"), "close");
        break;
    }
    currentMode = mode;
  }
}

export { PTBBuilder };
