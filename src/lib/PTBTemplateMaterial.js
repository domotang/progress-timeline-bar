"use strict";
import * as animations from "./pTBMaterialAnimations";
import * as components from "./pTBMaterialComponents";

export default StyledTemplate;

function StyledTemplate(styleOptions) {
  return Template;

  function Template(elementCount, status, eventWidth) {
    var xFactorLg = eventWidth
        ? eventWidth + 14
        : Math.round((styleOptions.barWidth.large - 170) / elementCount),
      xFactorLg2 = Math.round(
        (styleOptions.barWidth.large - 170) / elementCount
      ),
      xFactorSm = Math.round((styleOptions.barWidth.small - 97) / elementCount),
      eventWidthLg = eventWidth ? eventWidth : xFactorLg - 14,
      eventWidthLg2 = xFactorLg2 - 14,
      eventWidthSm = xFactorSm - 8,
      timelineBarWidthLg = status > 0 ? 194 + xFactorLg * (status - 1) : 164,
      timelineBarWidthLg2 = status > 0 ? 194 + xFactorLg2 * (status - 1) : 164,
      timelineBarWidthSm = status > 0 ? 194 + xFactorSm * (status - 1) : 164,
      modes = {
        small: { barHeight: 15, barPadding: 3, _containerHeight },
        large: { barHeight: 38, barPadding: 5, _containerHeight },
        detail: { barHeight: 90, barPadding: 5, _containerHeight }
      },
      bar = {},
      events = [],
      barModeAnimations = null,
      eventScrollAnimations = null,
      openedElements = { event: null, header: null, modal: null },
      mode = "detail",
      dragX = 0,
      scrollDiv = document.createElement("div");

    var publicAPI = {
      init,
      regBar,
      regEvent,
      setMode,
      closeEvents,
      Bar: components.getBarTmplt({ styleOptions, timelineBarWidthLg }),
      Event: components.getEventTmplt({
        xFactorLg,
        eventWidthLg,
        styleOptions
        // dragEventHandler: _dragEventHandler,
        // touchEventHandler: _touchEventHandler
      }),
      barHeights: _getBarHeights(),
      getStyles: _getStyles
    };

    // console.log(
    //   "xFactor:",
    //   xFactorLg,
    //   "eventWidth:",
    //   xFactorLg * 9,
    //   "barWidth:",
    //   styleOptions.barWidth.large - 170,
    //   "eventMove:",
    //   styleOptions.barWidth.large - 170 - xFactorLg * 9
    // );

    return publicAPI;

    //*************component registrations*****************

    function regBar({ element }) {
      var controlNodes = {
        barContainer: element,
        barDiv: element.querySelector(".proc-timeline"),
        barElement: element.querySelector(".proc-timeline-svg"),
        tag: element.querySelector(".header-bar"),
        events: element.querySelector(".events"),
        title: element.querySelector(".title"),
        detail: element.querySelector(".detail"),
        headerDetails: element.querySelector(".header-details"),
        eventDetails: element.querySelector(".event-details"),
        backButton: element.querySelector(".back-icon"),
        upButton: element.querySelector(".up-icon")
      };

      var animation = null;

      var internalBarAPI = {
        getHeaderState,
        getNodes,
        open,
        close
      };

      bar = internalBarAPI;

      function open(onResolve) {
        let opts = { bar, styleOptions, onResolve };
        // animation = animations.BarDetailAniTl(opts);

        animation.play();
        openedElements.header = internalBarAPI;
      }

      function close(onResolve) {
        // if (barPositionAnimation) barPositionAnimation.reverse();
        if (onResolve) {
          animation.vars.onReverseComplete = () => {
            onResolve();
          };
        }
        animation.reverse();
        openedElements.header = null;
      }

      function getNodes() {
        return controlNodes;
      }

      function getHeaderState() {
        return animation ? (animation.time() ? true : false) : false;
      }
    }

    function regEvent(event, type, id) {
      var controlNodes = {
        event,
        move: event.querySelector(".move"),
        tag: event.querySelector(".tag"),
        masked: event.querySelector(".masked"),
        title: event.querySelector(".title"),
        date: event.querySelector(".date"),
        icon: event.querySelector(".icon"),
        iconMove: event.querySelector(".icon-move"),
        iconGroup: event.querySelector(".icon-group"),
        iconShape: event.querySelector(".icon-shape"),
        iconSvg: event.querySelector(".icon-svg")
      };

      var internalEventAPI = {
        getNodes,
        close,
        id
      };

      events.push(internalEventAPI);

      var animation = null;

      var eventAPI = {
        open,
        deregister
      };
      return eventAPI;

      function open(expandedHeight, opts, onResolve) {
        if (openedElements.event) openedElements.event.close();
        openedElements.event = internalEventAPI;

        dragX = eventScrollAnimations.draggable.x;
        eventScrollAnimations.draggable.kill();
        eventScrollAnimations.tl.progress(0);
        _setEventScroll(id);

        if (!openedElements.modal) {
          _setModeModal({ ...opts, expandedHeight });
        }

        let { x, y, width } = event.getBBox();
        let upCoords = { x: width / 2 + x - 40, y: y + 90 };
        let { eventDetails, barElement, upButton } = bar.getNodes();
        let AniOpts = {
          type,
          controlNodes: {
            ...controlNodes,
            eventDetails,
            barElement,
            upButton
          },
          expandedHeight,
          barHeight: modes["detail"].barHeight + (expandedHeight + 130),
          upCoords,
          styleOptions,
          onResolve
        };
        animation = animations.EventOpenTl(AniOpts);
        animation.vars.onComplete = () => {
          // eventScrollAnimations.tl.progress(Math.abs(sysX / 450));
        };

        animation.play();
      }

      function close() {
        animation.reverse();
        openedElements.event = null;
      }

      function getNodes() {
        return controlNodes;
      }

      function deregister() {
        events = events.filter(event => event.id != id);
      }
    }
    //*************public methods*****************

    function setMode(mode, opts, onResolve) {
      if (openedElements.event) openedElements.event.close();
      if (openedElements.modal) {
        openedElements.modal.reverse();
        openedElements.modal = null;
      }

      switch (mode) {
        case "small":
          _setModeSmall(onResolve);
          break;
        case "large":
          _setModeLarge(onResolve);
          break;
        case "detail":
          _setModeDetail(onResolve);
          break;
        case "modal":
          _setModeModal(opts, onResolve);
          break;
      }
    }

    function init(initMode) {
      mode = initMode;
      let barNodes = bar.getNodes();
      let initOpts = {
        barNodes,
        mode,
        containerHeight: modes[mode]._containerHeight(),
        styleOptions
      };

      animations.initElementsTween(initOpts);

      let opts = {
        eventNodes: _getEventsNodesByType(),
        barNodes,
        styleOptions,
        timelineBarWidthLg,
        timelineBarWidthLg2,
        timelineBarWidthSm,
        eventWidthLg,
        eventWidthLg2,
        eventWidthSm,
        xFactorSm,
        xFactorLg2,
        elementCount,
        status,
        modes
      };
      barModeAnimations = animations.BarAniTl(opts);
      barModeAnimations.seek(mode);

      if (initMode === "detail") {
        _setEventScroll();
        eventScrollAnimations.tl.progress(0, false);
      }

      var showBarOpts = {
        barElement: bar.getNodes().barElement
      };
      animations.showBarTween(showBarOpts);
    }

    function closeEvents() {
      if (openedElements.event) {
        let opts = {
          nodes: bar.getNodes(),
          height: modes["detail"].barHeight + 100,
          eventClose: openedElements.event.close
        };
        var closeEventsAnimation = animations.EventsCloseTl(opts);
        closeEventsAnimation.play();
      }
    }

    //*************local methods*****************

    function _setModeLarge(onResolve) {
      if (eventScrollAnimations) {
        eventScrollAnimations.tl.progress(0);
        eventScrollAnimations.tl = null;
        eventScrollAnimations.draggable.kill();
      }
      mode = "large";
      let opts = {
        barContainer: bar.getNodes().barContainer,
        height: modes[mode]._containerHeight(),
        marginTop: "10px"
      };
      animations.containerTween(opts);
      barModeAnimations.tweenTo("large", {
        overwrite: true,
        onComplete: onResolve()
      });
    }

    function _setModeSmall(onResolve) {
      var set = mode != "small";
      var set2 = mode === "detail";
      mode = "small";
      let opts = {
        barContainer: bar.getNodes().barContainer,
        height: modes[mode]._containerHeight(),
        marginTop: "3px"
      };
      animations.containerTween(opts);

      if (set) {
        if (set2) barModeAnimations.timeScale(2);
        else barModeAnimations.timeScale(1);
        barModeAnimations.tweenTo("small", {
          overwrite: true,
          onComplete: () => {
            barModeAnimations.timeScale(1);
            onResolve();
          }
        });
      }
    }

    function _setModeDetail(onResolve) {
      _setEventScroll();
      mode = "detail";
      let opts = {
        barContainer: bar.getNodes().barContainer,
        height: modes[mode]._containerHeight(),
        marginTop: "10px"
      };
      animations.containerTween(opts);

      barModeAnimations.tweenTo("detail", {
        overwrite: true,
        onComplete: onResolve
      });
    }

    function _setModeModal(opts) {
      let AnimationOpts = {
        barTop: opts.barTop,
        nodes: bar.getNodes(),
        styleOptions,
        eventDrop: !!opts.expandedHeight,
        height:
          modes["detail"].barHeight +
          (opts.expandedHeight ? opts.expandedHeight + 130 : 100),
        barHeight: modes["detail"].barHeight,
        barModeAnimations
      };
      var barModalAnimation =
        barModeAnimations.currentLabel() != "detail"
          ? animations.BarModalSmallTl(AnimationOpts)
          : animations.BarModalDetailTl(AnimationOpts);

      barModalAnimation.play();

      openedElements.modal = barModalAnimation;
    }

    function _getEventsNodesByType() {
      var allNodesByType = {
        event: [],
        move: [],
        tag: [],
        masked: [],
        title: [],
        date: [],
        icon: [],
        iconMove: [],
        iconGroup: [],
        iconShape: [],
        iconSvg: []
      };

      for (var i = 0; i < events.length; i++) {
        let currentEventNodes = events[i].getNodes();
        for (let node in currentEventNodes) {
          allNodesByType[node].push(currentEventNodes[node]);
        }
      }
      return allNodesByType;
    }

    function _getBarHeights() {
      var modeHeights = {};
      for (let mode in modes) {
        modeHeights = { ...modeHeights, [mode]: modes[mode].barHeight };
      }
      return modeHeights;
    }

    function _getStyles() {
      return styleOptions;
    }

    function _containerHeight() {
      return this.barHeight + this.barPadding * 2;
    }

    // function _dragEventHandler(event) {
    //   eventScrollAnimations.progress(event.clientX / 1000);
    // }

    // function _touchEventHandler(event) {
    //   eventScrollAnimations.progress(event.changedTouches[0].clientX / 1000);
    // }

    function _setEventScroll(eventId) {
      let eventScrollOpts = {
        eventNodes: _getEventsNodesByType(),
        scrollDiv,
        visibleEventsWidth: styleOptions.barWidth.large - 170,
        xFactor: xFactorLg,
        selectedEventId: eventId != null ? eventId : null
      };
      eventScrollAnimations = animations.EventScrollAni(eventScrollOpts);
    }
  }
}
