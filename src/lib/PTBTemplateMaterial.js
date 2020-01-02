"use strict";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/src/MorphSVGPlugin";
import * as animations from "./pTBMaterialAnimations";
import * as components from "./pTBMaterialComponents";

gsap.registerPlugin(MorphSVGPlugin);

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
      barPositionAnimation = null,
      openedElements = { event: null, header: null },
      yHeight = 0,
      animationSpeed = 0.3,
      mode = "detail",
      modal = false;

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
        yHeight = 100;
        let opts = { bar, styleOptions, onResolve };
        animation = animations.BarDetailAniTl(opts);
        if (!openedElements.event) {
          _updateBarHeight(
            (openedElements.event
              ? openedElements.event.getExpandedHeight()
              : 0) +
              90 +
              yHeight,
            0.3,
            0.24
          );
        }

        animation.timeScale(animationSpeed);
        animation.play();
        openedElements.header = internalBarAPI;
      }

      function close(onResolve) {
        modal = false;
        if (barPositionAnimation) barPositionAnimation.reverse();
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
      var currentExpandedHeight = 0;
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
        getExpandedHeight,
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

        if (!modal) {
          _setModeModal(opts);
        }
        _updateBarHeight(expandedHeight + 130 + yHeight, 0.3, 0);

        let { x, y, width } = event.getBBox();
        var upCoords = { x: width / 2 + x - 40, y: y + 90 };

        currentExpandedHeight = expandedHeight;

        let AniOpts = {
          controlNodes,
          expandedHeight,
          styleOptions,
          bar,
          onResolve
        };
        animation =
          type === "loading"
            ? animations.EventLoadingAniTl(AniOpts)
            : type === "standard"
            ? animations.EventStandardAniOpenTl(AniOpts)
            : null;
        animation.vars.onComplete = () => {
          _updateEventBackButton(true, upCoords);
        };
        animation.timeScale(animationSpeed);
        animation.play();
      }

      function close(onResolve) {
        if (onResolve) {
          animation.vars.onReverseComplete = () => {
            onResolve();
          };
        }
        _updateEventBackButton(false, { x: 0, y: 0 });
        animation.reverse();
        openedElements.event = null;
      }

      function getNodes() {
        return controlNodes;
      }

      function getExpandedHeight() {
        return currentExpandedHeight;
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
        width:
          mode === "small"
            ? styleOptions.barWidth.small
            : styleOptions.barWidth.large,
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
        status
      };
      barModeAnimations = animations.BarAniTl(opts);
      barModeAnimations.seek(mode);
      _updateBarHeight(modes[mode].barHeight, 0);
      gsap.to(bar.getNodes().barElement, 0, {
        attr: {
          visibility: 1
        }
      });
    }

    function closeEvents() {
      if (openedElements.event) openedElements.event.close();
      _updateBarHeight(
        (openedElements.event ? openedElements.event.getExpandedHeight() : 0) +
          90 +
          yHeight,
        0.3,
        0.24
      );
    }

    //*************local methods*****************

    function _setModeLarge(onResolve) {
      mode = "large";
      if (openedElements.event) openedElements.event.close();
      if (openedElements.header) openedElements.header.close();
      changeMode();

      function changeMode() {
        yHeight = 0;
        _updateBarHeight(modes["large"].barHeight, 0.3);
        barModeAnimations.timeScale(animationSpeed);
        barModeAnimations.tweenTo("large", {
          overwrite: true,
          onComplete: onResolve()
        });
      }
    }

    function _setModeSmall(onResolve) {
      mode = "small";
      if (openedElements.event) openedElements.event.close();
      if (openedElements.header) openedElements.header.close();

      changeMode();
      function changeMode() {
        yHeight = 0;
        _updateBarHeight(modes["small"].barHeight, 0.6);
        barModeAnimations.timeScale(animationSpeed);
        barModeAnimations.tweenTo("small", {
          overwrite: true,
          onComplete: onResolve()
        });
      }
    }

    function _setModeDetail(onResolve) {
      mode = "detail";
      _updateBarHeight(modes["detail"].barHeight, 0.3, 0.2, onResolve);

      if (openedElements.event) openedElements.event.close();
      if (openedElements.header) openedElements.header.close();
      changeMode();

      function changeMode() {
        barModeAnimations.timeScale(animationSpeed);
        barModeAnimations.tweenTo("detail", {
          overwrite: true,
          onComplete: onResolve
        });
      }
    }

    // function _setModeModal(opts, onResolve) {
    //   modal = true;
    //   _setBarPosition(opts.barTop);

    //   if (barModeAnimations.currentLabel() != "detail") {
    //     _updateBarHeight(modes["detail"].barHeight, 0.3);
    //     return barModeAnimations.tweenTo("detail", {
    //       onComplete: () => barOpen(opts)
    //     });
    //   }

    //   barOpen(onResolve);

    //   function barOpen(onResolve) {
    //     if (!bar.getHeaderState()) bar.open(onResolve);
    //   }
    // }

    function _setModeModal(opts, onResolve) {
      modal = true;

      if (barModeAnimations.currentLabel() != "detail") {
        //modal().then(top & headerdetail)
        _setBarPosition(opts.barTop);
        _updateBarHeight(modes["detail"].barHeight, 0.3);
        barModeAnimations.tweenTo("detail", {
          onComplete: () => barOpen()
        });
      } else {
        barOpen(() => _setBarPosition(opts.barTop));
        //modal().then(spread).then().then(top & headerdetail & drop)
      }

      function barOpen(ops) {
        if (!bar.getHeaderState()) bar.open(ops);
      }
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

    function _updateEventBackButton(active, coords) {
      var upButton = bar.getNodes().upButton;

      let opts = {
        upButton,
        coords
      };

      var eventBtnAni = animations.BarEventUpBtnTl(opts);

      if (active) {
        eventBtnAni.play();
      } else {
        gsap.to(
          upButton,
          0.2,
          {
            attr: {
              visibility: 0,
              opacity: 0
            }
          },
          "set"
        );
      }
    }

    function _updateBarHeight(height, speed, delay, onResolve) {
      if (!modal) {
        gsap.to(
          bar.getNodes().barContainer,
          typeof speed !== "undefined" ? speed / (animationSpeed * 1.3) : 0.3,
          {
            height: height + modes[mode].barPadding * 2,
            // delay: delay ? delay : 0,
            attr: {
              height: height + modes[mode].barPadding * 2
            },
            ease: "Linear.easeNone"
          }
        );
      }

      gsap.to(
        bar.getNodes().barElement,
        typeof speed !== "undefined" ? speed / (animationSpeed * 1.3) : 0.3,
        {
          // delay: delay ? delay : 0,
          attr: {
            height: height
          },
          height: height,
          onComplete: onResolve,
          ease: "Linear.easeNone"
        }
      );
    }

    function _setBarPosition(top) {
      let opts = { bar, top };
      barPositionAnimation = animations.BarPositionTl(opts);
      barPositionAnimation.timeScale(animationSpeed);
      barPositionAnimation.play();
    }
  }
}
