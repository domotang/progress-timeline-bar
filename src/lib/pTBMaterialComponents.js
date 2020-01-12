import React from "react";

//*************component templates*****************

export function getBarTmplt({ styleOptions, timelineBarWidthLg }) {
  // eslint-disable-next-line react/display-name
  return props => {
    return (
      <svg
        className="proc-timeline-svg"
        id="tool-bar"
        xmlns="http://www.w3.org/2000/svg"
        width={styleOptions.barWidth.large}
        height="90"
        visibility="hidden"
        display="block"
      >
        <g
          className="top-element-node"
          id={`bar`}
          onClick={
            props.currentMode === "detail"
              ? () => {
                  props.barClick("modal");
                }
              : null
          }
          cursor={props.currentMode === "detail" ? "pointer" : "inherit"}
        >
          <path
            className="header-bar"
            id={`rect-`}
            d={`M0,0 h${timelineBarWidthLg} a6,6,0,0,1,6,5 l5, 13 h-${timelineBarWidthLg -
              157} a8,8,0,0,0,-7,7 l-20, 57 a8,8,0,0,1,-6,6 h-130 a6,6,0,0,1,-6,-6 v-76 a6,6,0,0,1,6,-6`}
            transform={`translate(0, 0)`}
            fill="#477578"
          />
          <defs>
            <clipPath id="mask">
              <path
                className="event-clip"
                d={`M0,0 h${858} v68 h-${882} Z`}
                transform={`translate(166, 20)`}
                fill="black"
              />
            </clipPath>
          </defs>
          {/* <path
            className="event-clip"
            d={`M0,0 h${858} v68 h-${882} Z`}
            transform={`translate(166, 20)`}
            fill="black"
          /> */}
          <text
            className="title"
            x="14"
            y="19"
            fontFamily="Verdana"
            fontSize="12"
            fontWeight="bold"
            fill={styleOptions.fontColor}
          >
            {props.title}
          </text>
          <text
            className="detail"
            x="14"
            y="36"
            fontFamily="Verdana"
            fontSize="15"
            fontWeight="bold"
            fill={styleOptions.fontColor}
          >
            {props.detail}
          </text>
        </g>
        <svg
          className="back-icon"
          x="0"
          y="48"
          visibility="hidden"
          onClick={
            props.currentMode === "modal"
              ? () => {
                  if (props.mode === "detail") return props.barClick("detail");
                  props.barClick("small");
                }
              : null
          }
          cursor={props.currentMode === "modal" ? "pointer" : "inherit"}
        >
          <g className="back-group">
            <path
              className="back-shape"
              opacity="0"
              id={`cir-${props.id}`}
              d="M0,00 h30 v90 h-30 v-90"
              transform="translate(2,2)"
              fill="#4a75a1"
              stroke={styleOptions.backgroundColor}
              strokeMiterlimit="10"
              strokeWidth="0"
            ></path>
            <svg
              stroke="currentColor"
              fill={styleOptions.fontColor}
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="icon-svg"
              x="0"
              y="8"
              fontSize="28"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167
                  239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4
                  9.4-24.6 0-33.9L217.9 256z"
              ></path>
            </svg>
          </g>
        </svg>
        <svg
          className="up-icon"
          x="30"
          y="68"
          visibility="hidden"
          onClick={() => {
            props.eventClick(null);
          }}
          cursor="pointer"
        >
          <g className="up-group">
            <path
              className="up-shape"
              opacity="0"
              id={`cir-${props.id}`}
              d="M0,20 h70 v70 h-70 v-70"
              transform="translate(2,2)"
              fill="#4a75a1"
              stroke={styleOptions.backgroundColor}
              strokeMiterlimit="10"
              strokeWidth="0"
            ></path>
            <svg
              stroke="currentColor"
              fill="white"
              strokeWidth="0"
              viewBox="0 0 512 512"
              className="icon-svg"
              x="28"
              y="56"
              fontSize="28"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273
                  167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4
                  24.6 9.4 33.9 0l127.1-127z"
              ></path>
            </svg>
          </g>
        </svg>
        <g className="events">{props.eventDomElements}</g>
      </svg>
    );
  };
}

export function getEventTmplt({
  xFactorLg,
  eventWidthLg,
  styleOptions,
  dragEventHandler,
  touchEventHandler
}) {
  // eslint-disable-next-line react/display-name
  return props => {
    var x = props.id * xFactorLg;
    var Icon = props.icon;

    return (
      <g
        className="top-element-node"
        id={`event-${props.id}`}
        // clipPath="url(#mask)"
        ref={props.setRef}
        cursor={
          props.currentMode != "large" && !props.opened ? "pointer" : "inherit"
        }
        // visibility="hidden"
        // visibility={
        //   x + eventWidthLg >= styleOptions.barWidth.large - 166
        //     ? "hidden"
        //     : "visible"
        // }
        onClick={() => {
          if (
            props.currentMode != "large" &&
            props.currentMode != "small" &&
            !props.opened
          ) {
            props.eventClick(props.id);
          }
        }}
        // draggable="true"
        // onDrag={dragEventHandler}
        // onDragEnd={dragEventHandler}
        // onTouchMove={touchEventHandler}
        // onTouchEnd={touchEventHandler}
      >
        <g className="masked" clipPath="url(#mask)">
          <g className="move">
            <path
              className="tag"
              overflow="hidden"
              id={`rect-${props.id}`}
              d={`M6,0 h${eventWidthLg} a6,6,0,0,1,6,6 l10, 28 l-10, 28 a6,6,0,0,1,-6,6 h-${eventWidthLg} a6,6,0,0,1,-6,-6 l10, -28 l-10, -28 a6,6,0,0,1,6,-6`}
              transform={`translate(${x + 144}, 20)`}
              fill={props.color}
            />
            <text
              className="title"
              fontFamily="Verdana"
              fontSize="12"
              fontWeight="bold"
              fill={styleOptions.fontColor}
              transform={`translate(${x + 190}, 33)`}
            >
              {props.title}
            </text>
            <text
              className="date"
              fontFamily="Verdana"
              fontSize="9"
              fontWeight="bold"
              fill={styleOptions.fontColor}
              transform={`translate(${x + 190}, 47)`}
            >
              {props.date}
            </text>
          </g>
        </g>
        <g className="icon-move">
          <svg className="icon" x={x + 132} y="8">
            <g className="icon-group">
              <path
                className="icon-shape"
                id={`cir-${props.id}`}
                d="M0,25 a25,25,0,0,1,50,0 a25,25,0,0,1,-50,0"
                transform="translate(2,2)"
                fill={
                  props.isOnStatus
                    ? styleOptions.eventOnStatusColor
                    : props.isCompleted
                    ? styleOptions.eventCompletedColor
                    : props.color
                }
                stroke={styleOptions.backgroundColor}
                style={{ strokeOpacity: 1 }}
                strokeMiterlimit="10"
                strokeWidth="2"
              ></path>
              <Icon
                className="icon-svg"
                fill={styleOptions.fontColor}
                x="13"
                y="13"
                fontSize="28"
              />
            </g>
          </svg>
        </g>
      </g>
    );
  };
}
