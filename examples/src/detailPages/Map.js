import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from "react-simple-maps";
import world from "../lib/ne_110m_land.json";

// const map = "http://domosavant.com/ne_110m_land.json";
var map = world;

function Map({ fromCoord, toCoord, destination, offset }) {
  var markers = [
    {
      markerOffset: 10,
      name: "Houston",
      coordinates: [-95.358421, 29.749907]
    }
  ];

  markers.push({
    markerOffset: offset ? 10 : -10,
    name: destination,
    coordinates: toCoord
  });
  return (
    <ComposableMap
      width={260}
      height={100}
      projection="geoEqualEarth"
      projectionConfig={{
        // rotate: [50, -10],
        scale: 40
      }}
    >
      <Geographies geography={map}>
        {({ geographies }) =>
          geographies
            // .filter(d => d.properties.REGION_UN === "Africa")
            .map(geo => (
              <Geography key={geo.rsmKey} geography={geo} fill="white" />
            ))
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={4} fill="#b31717" stroke="#fff" strokeWidth={2} />
          <text
            textAnchor="middle"
            y={markerOffset}
            style={{
              fontFamily: "Verdana",
              fontSize: "12px",
              fontWeight: "bold",
              fill: "blue"
            }}
          >
            {name}
          </text>
        </Marker>
      ))}
      <Line
        from={markers[0].coordinates}
        to={markers[1].coordinates}
        stroke="#b31717"
        strokeWidth={1}
      ></Line>
    </ComposableMap>
  );
}

export default Map;
