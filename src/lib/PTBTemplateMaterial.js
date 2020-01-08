"use strict";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import * as animations from "./pTBMaterialAnimations";
import * as components from "./pTBMaterialComponents";

gsap.registerPlugin(MorphSVGPlugin);
gsap.globalTimeline.timeScale(1);

export default StyledTemplate;

function StyledTemplate(styleOptions) {
  return Template;

  function Template(elementCount, status) {
    var xFactorLg = Math.round(
        (styleOptions.barWidth.large - 166) / elementCount
      ),
      xFactorSm = Math.round((styleOptions.barWidth.small - 97) / elementCount),
      eventWidthLg = xFactorLg - 15,
      eventWidthSm = xFactorSm - 8,
      timelineBarWidthLg = status > 0 ? 194 + xFactorLg * (status - 1) : 164,
      timelineBarWidthSm = status > 0 ? 194 + xFactorSm * (status - 1) : 164,
      modes = {
        small: { barHeight: 15, barPadding: 3 },
        large: { barHeight: 38, barPadding: 5 },
        detail: { barHeight: 90, barPadding: 5 }
      },
      bar = {},
      events = [],
      barModeAnimations = null,
      openedElements = { event: null, header: null, modal: null },
      mode = "detail";

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
      }),
      barHeights: _getBarHeights(),
      getStyles: _getStyles
    };

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
        tag: event.querySelector(".tag"),
        title: event.querySelector(".title"),
        date: event.querySelector(".date"),
        icon: event.querySelector(".icon"),
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

        if (!openedElements.modal) {
          _setModeModal({ ...opts, expandedHeight });
        }

        let { x, y, width } = event.getBBox();
        var upCoords = { x: width / 2 + x - 40, y: y + 90 };

        let AniOpts = {
          type,
          controlNodes: {
            ...controlNodes,
            eventDetails: bar.getNodes().eventDetails,
            barElement: bar.getNodes().barElement,
            upButton: bar.getNodes().upButton
          },
          expandedHeight,
          barHeight: modes["detail"].barHeight + (expandedHeight + 130),
          upCoords,
          styleOptions,
          onResolve
        };
        animation = animations.EventOpenTl(AniOpts);

        animation.play();
      }

      function close(onResolve) {
        // if (onResolve) {
        // animation.vars.onReverseComplete = () => {
        //   onResolve();
        // };
        // }
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

    function init(mode) {
      gsap.to(bar.getNodes().barContainer, 0, {
        marginTop: mode === "small" ? "3px" : "10px",
        position: "relative",
        marginLeft: "10px"
      });

      gsap.to(bar.getNodes().barDiv, 0, {
        backgroundColor: styleOptions.backgroundColor,
        padding: mode === "small" ? "3px" : "5px",
        width: styleOptions.barWidth.large,
        borderRadius: "5px",
        position: "relative",
        zIndex: 0
      });

      gsap.to(bar.getNodes().headerDetails, 0, {
        top: 10,
        left: 170,
        opacity: 0,
        position: "absolute"
      });

      gsap.to(bar.getNodes().eventDetails, 0, {
        top: 100,
        left: 150,
        opacity: 0,
        position: "absolute"
      });

      let opts = {
        eventNodes: _getEventsNodesByType(),
        bar,
        styleOptions,
        timelineBarWidthLg,
        timelineBarWidthSm,
        eventWidthLg,
        eventWidthSm,
        xFactorSm,
        elementCount,
        status,
        modes
      };
      barModeAnimations = animations.BarAniTl(opts);
      barModeAnimations.seek(mode);
      gsap.to(bar.getNodes().barElement, 0, {
        attr: {
          visibility: 1
        }
      });
    }

    function closeEvents() {
      if (openedElements.event) openedElements.event.close();
    }

    //*************local methods*****************

    function _setModeLarge(onResolve) {
      mode = "large";
      if (openedElements.event) openedElements.event.close();
      if (openedElements.header) openedElements.header.close();
      changeMode();

      function changeMode() {
        barModeAnimations.tweenTo("large", {
          overwrite: true,
          onComplete: onResolve()
        });
      }
    }

    function _setModeSmall(onResolve) {
      mode = "small";
      if (openedElements.event) openedElements.event.close();
      if (openedElements.modal) {
        openedElements.modal.reverse();
        openedElements.modal = null;
      }

      // changeMode();
      // function changeMode() {
      //   yHeight = 0;
      //   barModeAnimations.tweenTo("small", {
      //     overwrite: true,
      //     onComplete: onResolve()
      //   });
      // }
    }

    function _setModeDetail(onResolve) {
      mode = "detail";

      if (openedElements.event) openedElements.event.close();
      if (openedElements.modal) {
        openedElements.modal.reverse();
        openedElements.modal = null;
      }
      changeMode();

      function changeMode() {
        barModeAnimations.tweenTo("detail", {
          overwrite: true,
          onComplete: onResolve
        });
      }
    }

    function _setModeModal(opts) {
      let AnimationOpts = {
        ...opts,
        nodes: bar.getNodes(),
        styleOptions,
        height:
          modes["detail"].barHeight +
          (opts.expandedHeight ? opts.expandedHeight + 130 : 100),
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
        tag: [],
        title: [],
        date: [],
        icon: [],
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
  }
}
