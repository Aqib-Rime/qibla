// Dark Google Maps style that flips the usual pattern: the map is a
// readable mid-dark gray (land #272b29, roads lifted) while the floating
// UI (bg-surface = #181d1a) sits DARKER than the map. This mirrors the
// Uber/Lyft dark treatment — chrome is the deepest tone, map is a tier
// lighter with visible roads — so buttons pop without relying on hue
// games. Parks keep a hint of brand green.
// Passed to <MapView customMapStyle={...} /> when the theme is dark.
export const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#272b29" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a908c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c201e" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#3a3e3c" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a8aeaa" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd0cc" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a908c" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1f2a23" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5ba17a" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#3a3e3c" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c201e" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a0a6a2" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4c5250" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1c201e" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d0d4d0" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2e3230" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a908c" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#14181a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a5450" }],
  },
];
