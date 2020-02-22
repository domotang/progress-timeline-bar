"use strict";
import * as animations from "../template/pTBMaterialAnimations";
import * as components from "../template/pTBMaterialComponents";
import StateMachine from "../lib/stateMachine";

export default StyledTemplate;

function StyledTemplate(styleOptions) {
  return Template;

  function Template(elementCount, status, eventWidth) {
    var xFactorDtl = eventWidth
        ? eventWidth + 14
        : Math.round((styleOptions.barWidth.large - 170) / elementCount),
      xFactorLg = Math.round(
        (styleOptions.barWidth.large - 170) / elementCount
      ),
      xFactorSm = Math.round((styleOptions.barWidth.small - 97) / elementCount),
      eventWidthDtl = eventWidth ? eventWidth : xFactorDtl - 14,
      eventWidthLg = xFactorLg - 14,
      eventWidthSm = xFactorSm - 8,
      draggableEnabled =
        !!eventWidth &&
        xFactorDtl * elementCount > styleOptions.barWidth.large - 170,
      timelineBarWidthDtl = draggableEnabled
        ? styleOptions.barWidth.large - 100
        : status > 0
        ? 194 + xFactorDtl * (status - 1)
        : 164,
      timelineBarWidthLg = status > 0 ? 194 + xFactorLg * (status - 1) : 164,
      timelineBarWidthSm = status > 0 ? 194 + xFactorSm * (status - 1) : 164,
      modeDefaults = {
        small: {
          barHeight: 15,
          barPadding: 3,
          marginTop: "3px",
          calculated() {
            var xFactor = Math.round(
              (styleOptions.barWidth.small - 97) / elementCount
            );
            var eventWidth = xFactor - 8;
            var timelineBarWidth =
              status > 0 ? 194 + xFactor * (status - 1) : 164;
            return {
              xFactor,
              eventWidth,
              timelineBarWidth
            };
          }
        },
        large: {
          barHeight: 38,
          barPadding: 5,
          marginTop: "10px",
          calculated() {
            var xFactor = Math.round(
              (styleOptions.barWidth.large - 170) / elementCount
            );
            var eventWidth = xFactor - 14;
            var timelineBarWidth =
              status > 0 ? 194 + xFactor * (status - 1) : 164;
            return {
              xFactor,
              eventWidth,
              timelineBarWidth
            };
          }
        },
        detail: {
          barHeight: 90,
          barPadding: 5,
          marginTop: "10px",
          calculated() {
            var xFactor = eventWidth
              ? eventWidth + 14
              : Math.round((styleOptions.barWidth.large - 170) / elementCount);
            var eventWidth = eventWidth ? eventWidth : xFactor - 14;
            var timelineBarWidth = draggableEnabled
              ? styleOptions.barWidth.large - 100
              : status > 0
              ? 194 + xFactor * (status - 1)
              : 164;
            return {
              xFactor,
              eventWidth,
              timelineBarWidth
            };
          }
        }
      },
      // modes2 = {
      //   small: {
      //     bar: {
      //       height: 15,
      //       timelineWidth: null,
      //       padding: 3,
      //       marginTop: "3px"
      //     },
      //     event: {
      //       width: null,
      //       xFactor: null
      //     }
      //   },
      //   large: {
      //     barHeight: 38,
      //     barPadding: 5,
      //     marginTop: "10px"
      //   },
      //   detail: {
      //     barHeight: 90,
      //     barPadding: 5,
      //     marginTop: "10px"
      //   }
      // },
      modes = {},
      bar = {},
      events = [],
      barModeAnimations = null,
      eventScrollAnimations = null,
      openedElements = { event: null, header: null, modal: null },
      scrollDiv = document.createElement("div");

    var Mode = {
      init({ barHeight, barPadding, marginTop }) {
        this.bar = {};
        this.event = {};
        (this.bar.height = barHeight),
          (this.bar.padding = barPadding),
          (this.bar.marginTop = marginTop);
      },
      get containerHeight() {
        return this.bar.height + this.bar.padding * 2;
      }
    };

    for (let mode in modeDefaults) {
      _addMode(mode, modeDefaults[mode]);
    }

    function _addMode(name, mode) {
      modes[name] = Object.create(Mode);
      modes[name].init(mode);
    }

    var modeStateMachineDef = {
      initValue: "init",
      init: {
        actions: {
          onEnter() {},
          onExit() {
            animations.showBarTween({ barElement: bar.getNodes().barElement });
          }
        },
        transitions: {
          small: {
            target: "small",
            action() {
              barModeAnimations.seek("small");
            }
          },
          large: {
            target: "large",
            action() {
              barModeAnimations.seek("large");
            }
          },
          detail: {
            target: "detail",
            action() {
              barModeAnimations.seek("detail");
              if (draggableEnabled) eventScrollAnimations.create();
            }
          },
          modal: {
            target: "modal",
            action() {}
          }
        }
      },
      small: {
        actions: {
          onEnter() {},
          onExit() {}
        },
        transitions: {
          large: {
            target: "large",
            action() {
              _setMode({ mode: "large" });
            }
          },
          detail: {
            target: "detail",
            action() {
              _setMode({ mode: "detail" });
              if (draggableEnabled) eventScrollAnimations.create();
            }
          },
          modal: {
            target: "modal",
            action(opts) {
              _setModeModal(opts);
              if (draggableEnabled) eventScrollAnimations.create();
            }
          }
        }
      },
      large: {
        actions: {
          onEnter() {},
          onExit() {}
        },
        transitions: {
          small: {
            target: "small",
            action() {
              _setMode({ mode: "small" });
            }
          },
          detail: {
            target: "detail",
            action() {
              _setMode({ mode: "detail" });
              if (draggableEnabled) eventScrollAnimations.create();
            }
          }
        }
      },
      detail: {
        actions: {
          onEnter() {},
          onExit() {}
        },
        transitions: {
          small: {
            target: "small",
            action() {
              if (draggableEnabled) eventScrollAnimations.kill();
              _setMode({ mode: "small" });
            }
          },
          large: {
            target: "large",
            action() {
              if (draggableEnabled)
                return eventScrollAnimations
                  .kill()
                  .then(() => _setMode({ mode: "large" }));
              _setMode({ mode: "large" });
            }
          },
          modal: {
            target: "modal",
            action(opts) {
              _setModeModal(opts);
            }
          }
        }
      },
      modal: {
        actions: {
          onEnter() {},
          onExit() {
            if (openedElements.event) openedElements.event.close();
            if (draggableEnabled) eventScrollAnimations.updateEvent(null);
            openedElements.modal.reverse();
            openedElements.modal = null;
          }
        },
        transitions: {
          small: {
            target: "small",
            action() {
              if (draggableEnabled) eventScrollAnimations.kill();
            }
          },
          detail: {
            target: "detail",
            action() {}
          }
        }
      }
    };

    var modeStateMachine = null;

    {
      let publicAPI = {
        init,
        regBar,
        regEvent,
        setMode,
        closeEvents,
        Bar: components.getBarTmplt({ styleOptions, timelineBarWidthDtl }),
        Event: components.getEventTmplt({
          xFactorDtl,
          eventWidthDtl,
          styleOptions
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
    }

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
        upButton: element.querySelector(".up-group"),
        upButtonClip: element.querySelector(".up-group-clip")
      };

      // var animation = null;

      var internalBarAPI = {
        // getHeaderState,
        getNodes,
        open,
        close
      };

      bar = internalBarAPI;

      function open(onResolve) {
        // let opts = { bar, styleOptions, onResolve };
        // animation = animations.BarDetailAniTl(opts);
        // animation.play();
        // openedElements.header = internalBarAPI;
      }

      function close(onResolve) {
        // if (barPositionAnimation) barPositionAnimation.reverse();
        // if (onResolve) {
        //   animation.vars.onReverseComplete = () => {
        //     onResolve();
        //   };
        // }
        // animation.reverse();
        // openedElements.header = null;
      }

      function getNodes() {
        return controlNodes;
      }

      // function getHeaderState() {
      //   return animation ? (animation.time() ? true : false) : false;
      // }
    }

    function regEvent(event, type, id, expandedHeight) {
      var controlNodes = {
        event,
        tagMove: event.querySelector(".tag-move"),
        tag: event.querySelector(".tag"),
        masked: event.querySelector(".masked"),
        title: event.querySelector(".title"),
        date: event.querySelector(".date"),
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

      {
        let eventAPI = {
          open,
          deregister
        };
        return eventAPI;
      }

      function open(opts, onResolve) {
        if (openedElements.event) openedElements.event.close();
        openedElements.event = internalEventAPI;
        if (draggableEnabled) eventScrollAnimations.updateEvent(id);

        modeStateMachine.transition("modal", { ...opts, expandedHeight });

        animation = animations.EventOpenTl(_eventAnimationOpts(onResolve, 0));
        animation.play();
      }

      function close() {
        if (draggableEnabled) {
          if (!eventScrollAnimations.scrollPosHasMoved()) {
            eventScrollAnimations.updateEvent(null);
          } else {
            let iconOffset = eventScrollAnimations.updateEvent(null, animation);

            animation = animations.EventOpenTl(
              _eventAnimationOpts(null, iconOffset)
            );
            animation.seek(animation.totalDuration());
          }
        }

        animation.reverse();
        openedElements.event = null;
      }

      function getNodes() {
        return controlNodes;
      }

      function deregister() {
        events = events.filter(event => event.id != id);
      }

      function _eventAnimationOpts(onResolve, iconOffset) {
        {
          let { x, y, width } = event.getBBox();
          var upCoords = { x: width / 2 + x - 40, y: y + 90 };
        }

        var {
          eventDetails,
          barElement,
          upButton,
          upButtonClip
        } = bar.getNodes();

        return {
          type,
          controlNodes: {
            ...controlNodes,
            eventDetails,
            barElement,
            upButton,
            upButtonClip
          },
          expandedHeight,
          barHeight: modes.detail.bar.height + (expandedHeight + 130),
          upCoords,
          xFactor: xFactorDtl,
          scrollOffset: draggableEnabled
            ? eventScrollAnimations.scrollOffset()
            : 0,
          scrollIconOffset: draggableEnabled
            ? eventScrollAnimations.scrollOffset() -
              (iconOffset ? iconOffset : 0)
            : 0,
          styleOptions,
          onResolve
        };
      }
    }
    //*************public methods*****************

    function setMode(mode, opts) {
      modeStateMachine.transition(mode, opts);
    }

    function init(initMode) {
      console.log("modes", modes);
      var barNodes = bar.getNodes();
      {
        let initOpts = {
          barNodes,
          mode: initMode,
          containerHeight: modes[initMode].containerHeight,
          styleOptions
        };

        animations.initElementsTween(initOpts);
      }
      {
        let opts = {
          eventNodes: _getEventsNodesByType(),
          barNodes,
          styleOptions,
          timelineBarWidthLg,
          timelineBarWidthSm,
          eventWidthLg,
          eventWidthSm,
          xFactorSm,
          xFactorLg,
          elementCount,
          status,
          modes
        };
        barModeAnimations = animations.BarAniTl(opts);
      }
      eventScrollAnimations = draggableEnabled
        ? animations.EventScrollAni({
            eventNodes: _getEventsNodesByType(),
            upButton: bar.getNodes().upButton,
            scrollDiv,
            visibleEventsWidth: styleOptions.barWidth.large - 170,
            xFactor: xFactorDtl
          })
        : null;
      modeStateMachine = StateMachine(modeStateMachineDef);
      modeStateMachine.transition(initMode);
    }

    function closeEvents() {
      if (openedElements.event) {
        let opts = {
          nodes: bar.getNodes(),
          height: modes["detail"].bar.height + 100,
          eventClose: openedElements.event.close
        };
        var closeEventsAnimation = animations.EventsCloseTl(opts);
        closeEventsAnimation.play();
      }
    }

    //*************local methods*****************

    function _setMode({ mode }) {
      var modeStyles = modes[mode];
      {
        let opts = {
          barContainer: bar.getNodes().barContainer,
          height: modeStyles.containerHeight,
          marginTop: modeStyles.bar.marginTop
        };
        animations.containerTween(opts);
      }
      barModeAnimations.tweenTo(mode, {
        overwrite: true
        // onComplete: onResolve()
      });
    }

    function _setModeModal(opts) {
      var AnimationOpts = {
        barTop: opts.barTop,
        nodes: bar.getNodes(),
        styleOptions,
        eventDrop: !!opts.expandedHeight,
        height:
          modes.detail.bar.height +
          (opts.expandedHeight ? opts.expandedHeight + 130 : 100),
        barHeight: modes.detail.bar.height,
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
      var allNodesByType = {};

      for (let i = 0; i < events.length; i++) {
        let currentEventNodes = events[i].getNodes();
        for (let node in currentEventNodes) {
          if (!allNodesByType[node]) allNodesByType[node] = [];
          allNodesByType[node].push(currentEventNodes[node]);
        }
      }
      return allNodesByType;
    }

    function _getBarHeights() {
      var modeHeights = {};
      for (let mode in modes) {
        modeHeights = { ...modeHeights, [mode]: modes[mode].bar.height };
      }
      return modeHeights;
    }

    function _getStyles() {
      return styleOptions;
    }
  }
}
