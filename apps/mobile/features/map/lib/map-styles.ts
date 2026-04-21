// Dark Google Maps style tuned to the app's dark palette (lib/theme.ts).
// Pushed deeper than the `surface` token so floating UI (top pill, FAB,
// bottom sheet) pops against the map instead of camouflaging into it.
// Passed to <MapView customMapStyle={...} /> when the theme is dark.
export const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#05080a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7a847f" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#1a1f1c" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9aa39e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c8cbc6" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7a847f" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0d1612" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5ba17a" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#14191a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a948f" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1f2624" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c8cbc6" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#0d1612" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7a847f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3a4d42" }],
  },
];
