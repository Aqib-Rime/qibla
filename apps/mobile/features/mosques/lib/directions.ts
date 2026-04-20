import { Linking, Platform } from "react-native";

export function openDirections({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  const label = encodeURIComponent(name);
  const url =
    Platform.OS === "ios"
      ? `comgooglemaps://?daddr=${lat},${lng}&q=${label}`
      : `google.navigation:q=${lat},${lng}`;
  const fallback =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${label}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  Linking.openURL(url).catch(() => Linking.openURL(fallback));
}
