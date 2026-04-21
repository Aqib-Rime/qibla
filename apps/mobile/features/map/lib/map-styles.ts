// Shared minimal-map stylers — we want the map to feel like a quiet canvas
// for mosque markers, not a cluttered atlas. Hides POIs, businesses,
// transit, all road labels, and neighborhood/land-parcel boundaries.
// Keeps only geometry + country/locality labels for coarse wayfinding.
const MINIMAL_STYLERS = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.province",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

// Light-mode minimal map — uses Google's default light colors but strips
// out the same clutter as the dark style, so toggling themes keeps the
// same "quiet canvas" feel.
export const LIGHT_MAP_STYLE = MINIMAL_STYLERS;

// Dark-mode style: flipped tonal pattern — map ground is mid-dark gray
// so the `bg-surface` chrome (#181d1a) sits DARKER than the map, like
// the Uber/Lyft dark treatment. Parks keep a hint of brand green.
// Also inherits the MINIMAL_STYLERS clutter removal.
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
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1f2a23" }],
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
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#14181a" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a5450" }],
  },
  ...MINIMAL_STYLERS,
];
