export function getModeDefaults(attr) {
  return {
    small: {
      bar: {
        height: 15,
        padding: 3,
        marginTop: "3px"
      },
      event: {},
      calculatedDefaults() {
        var xFactor = Math.round(
          (attr.styleOptions.barWidth.small - 97) / attr.elementCount
        );
        var eventWidth = xFactor - 8;
        var width = attr.status > 0 ? 194 + xFactor * (attr.status - 1) : 164;
        return {
          bar: { width },
          event: { xFactor, width: eventWidth }
        };
      }
    },
    large: {
      bar: {
        height: 38,
        padding: 5,
        marginTop: "10px"
      },
      event: {},
      calculatedDefaults() {
        var xFactor = Math.round(
          (attr.styleOptions.barWidth.large - 170) / attr.elementCount
        );
        var eventWidth = xFactor - 14;
        var width = attr.status > 0 ? 194 + xFactor * (attr.status - 1) : 164;
        return {
          bar: { width },
          event: { xFactor, width: eventWidth }
        };
      }
    },
    detail: {
      bar: {
        height: attr.card ? attr.barExpandedHeight : 90,
        padding: 5,
        marginTop: "10px",
        modalHeightPadding: attr.card ? attr.barExpandedHeight + 10 : 100,
        modalExpandedHeightPadding: attr.card
          ? attr.barExpandedHeight + 40
          : 130,
        widthOffset: 170
      },
      calculatedDefaults() {
        var xFactor = attr.eventWidthAttr
          ? attr.eventWidthAttr + 14
          : Math.round(
              (attr.styleOptions.barWidth.large - this.bar.widthOffset) /
                attr.elementCount
            );
        var eventWidth = attr.eventWidthAttr
          ? attr.eventWidthAttr
          : xFactor - 14;
        var draggable =
          !!attr.eventWidthAttr &&
          xFactor * attr.elementCount >
            attr.styleOptions.barWidth.large - this.bar.widthOffset;
        var width = draggable
          ? attr.styleOptions.barWidth.large - 100
          : attr.status > 0
          ? 194 + xFactor * (attr.status - 1)
          : 164;
        return {
          bar: { width, draggable },
          event: { xFactor, width: eventWidth }
        };
      }
    }
  };
}
