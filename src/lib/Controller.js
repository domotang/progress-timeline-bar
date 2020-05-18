"use strict";
import StateMachine from "./stateMachine";

export default Controller;

function Controller(args) {
  var modes = {},
    bar = {},
    events = [],
    barModeAnimations = null,
    eventScrollAnimations = null,
    modeStateMachine = null,
    openedElements = { event: null, header: null, modal: null },
    styleOptions = args.Template.styleOptions,
    elementCount = args.elementCount,
    status = args.status,
    eventWidthAttr = args.eventWidthAttr,
    Template = args.Template,
    scrollDiv = document.createElement("div");

  var modeAttr = {
    styleOptions,
    elementCount,
    eventWidthAttr,
    status
  };

  var modeDefaults = Template.Defaults.getModeDefaults(modeAttr);

  var Mode = {
    init(defaults) {
      this.bar = defaults.bar;
      this.event = defaults.event;
    },
    get containerHeight() {
      return this.bar.height + this.bar.padding * 2;
    }
  };

  (function buildModes() {
    for (let mode in modeDefaults) {
      _addMode(mode, modeDefaults[mode]);
    }

    function _addMode(name, mode) {
      var calculatedDefaults = mode.calculatedDefaults();
      modes[name] = Object.create(Mode);
      {
        let bar = { ...mode.bar, ...calculatedDefaults.bar },
          event = { ...mode.event, ...calculatedDefaults.event };
        modes[name].init({ bar, event });
      }
    }
  })();

  var modeStateMachineDef = {
    initValue: "init",
    init: {
      actions: {
        onEnter() {},
        onExit() {
          Template.Animations.showBarTween({
            barElement: bar.getNodes().barElement
          });
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
            if (modes.detail.bar.draggable) eventScrollAnimations.create();
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
            if (modes.detail.bar.draggable) eventScrollAnimations.create();
          }
        },
        modal: {
          target: "modal",
          action(opts) {
            _setModeModal(opts);
            if (modes.detail.bar.draggable) eventScrollAnimations.create();
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
            if (modes.detail.bar.draggable) eventScrollAnimations.create();
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
            if (modes.detail.bar.draggable) eventScrollAnimations.kill();
            _setMode({ mode: "small" });
          }
        },
        large: {
          target: "large",
          action() {
            if (modes.detail.bar.draggable)
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
          if (modes.detail.bar.draggable)
            eventScrollAnimations.updateEvent(null);
          openedElements.modal.reverse();
          openedElements.modal = null;
        }
      },
      transitions: {
        small: {
          target: "small",
          action() {
            if (modes.detail.bar.draggable) eventScrollAnimations.kill();
          }
        },
        detail: {
          target: "detail",
          action() {}
        }
      }
    }
  };

  {
    {
      let publicAPI = {
        init,
        regBar,
        regEvent,
        setMode,
        closeEvents,
        Bar: Template.Components.getBarTmplt({
          styleOptions,
          width: modes.detail.bar.width
        }),
        Event: Template.Components.getEventTmplt({
          xFactorDtl: modes.detail.event.xFactor,
          eventWidthDtl: modes.detail.event.width,
          styleOptions
        }),
        getStyles: _getStyles
      };

      return publicAPI;
    }
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
      if (modes.detail.bar.draggable) eventScrollAnimations.updateEvent(id);

      modeStateMachine.transition("modal", { ...opts, expandedHeight });

      animation = Template.Animations.EventOpenTl(
        _eventAnimationOpts(onResolve, 0)
      );
      animation.play();
    }

    function close() {
      if (modes.detail.bar.draggable) {
        if (!eventScrollAnimations.scrollPosHasMoved()) {
          eventScrollAnimations.updateEvent(null);
        } else {
          let iconOffset = eventScrollAnimations.updateEvent(null, animation);

          animation = Template.Animations.EventOpenTl(
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

      var { eventDetails, barElement, upButton, upButtonClip } = bar.getNodes();

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
        barHeight:
          modes.detail.bar.height +
          (expandedHeight + modes.detail.bar.modalExpandedHeightPadding),
        upCoords,
        scrollOffset: modes.detail.bar.draggable
          ? eventScrollAnimations.scrollOffset()
          : 0,
        scrollIconOffset: modes.detail.bar.draggable
          ? eventScrollAnimations.scrollOffset() - (iconOffset ? iconOffset : 0)
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

      Template.Animations.initElementsTween(initOpts);
    }
    {
      let opts = {
        eventNodes: _getEventsNodesByType(),
        barNodes,
        styleOptions,
        elementCount,
        status,
        smallMode: modes.small,
        largeMode: modes.large
      };
      barModeAnimations = Template.Animations.BarAniTl(opts);
    }
    eventScrollAnimations = modes.detail.bar.draggable
      ? Template.Animations.EventScrollAni({
          eventNodes: _getEventsNodesByType(),
          upButton: bar.getNodes().upButton,
          scrollDiv,
          visibleEventsWidth:
            styleOptions.barWidth.large - modes.detail.bar.widthOffset,
          xFactor: modes.detail.event.xFactor
        })
      : null;
    modeStateMachine = StateMachine(modeStateMachineDef);
    modeStateMachine.transition(initMode);
  }

  function closeEvents() {
    if (openedElements.event) {
      let opts = {
        nodes: bar.getNodes(),
        height:
          modes["detail"].bar.height + modes.detail.bar.modalHeightPadding,
        eventClose: openedElements.event.close
      };
      var closeEventsAnimation = Template.Animations.EventsCloseTl(opts);
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
      Template.Animations.containerTween(opts);
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
        (opts.expandedHeight
          ? opts.expandedHeight + modes.detail.bar.modalExpandedHeightPadding
          : modes.detail.bar.modalHeightPadding),
      barHeight: modes.detail.bar.height,
      barModeAnimations
    };
    var barModalAnimation =
      barModeAnimations.currentLabel() != "detail"
        ? Template.Animations.BarModalSmallTl(AnimationOpts)
        : Template.Animations.BarModalDetailTl(AnimationOpts);

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

  function _getStyles() {
    return styleOptions;
  }
}
