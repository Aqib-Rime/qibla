import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useUserLocation } from "@/lib/use-user-location";

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

const DEFAULT_REGION: Region = {
  latitude: 23.7806,
  longitude: 90.4078,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function LocationPicker({ lat, lng, onChange }: Props) {
  const mapRef = useRef<MapView>(null);
  const userPos = useUserLocation();
  const [hasCentered, setHasCentered] = useState(false);

  const hasCoords = lat !== 0 && lng !== 0;

  // If the form starts with empty (0,0) coords, seed from user location when it arrives.
  useEffect(() => {
    if (hasCoords) return;
    if (hasCentered) return;
    if (!userPos) return;
    onChange(userPos.lat, userPos.lng);
    setHasCentered(true);
  }, [userPos, hasCoords, hasCentered, onChange]);

  const handleUseMyLocation = () => {
    if (!userPos) return;
    onChange(userPos.lat, userPos.lng);
    mapRef.current?.animateToRegion(
      {
        latitude: userPos.lat,
        longitude: userPos.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      400,
    );
  };

  return (
    <View className="gap-s-3">
      <View className="flex-row items-center justify-between">
        <Text variant="label">Location</Text>
        <Pressable
          onPress={handleUseMyLocation}
          disabled={!userPos}
          style={({ pressed }) => ({ opacity: pressed || !userPos ? 0.5 : 1 })}
        >
          <Text variant="caption" tone="green">
            Use my location
          </Text>
        </Pressable>
      </View>

      <View className="overflow-hidden rounded-md border border-line">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ width: "100%", height: 260 }}
          initialRegion={
            hasCoords
              ? {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : DEFAULT_REGION
          }
          showsUserLocation
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          onPress={(e) => {
            onChange(
              e.nativeEvent.coordinate.latitude,
              e.nativeEvent.coordinate.longitude,
            );
          }}
        >
          {hasCoords ? (
            <Marker
              coordinate={{ latitude: lat, longitude: lng }}
              draggable
              onDragEnd={(e) => {
                onChange(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude,
                );
              }}
            >
              <View className="h-8 w-8 items-center justify-center rounded-pill border-2 border-white bg-green shadow-sm">
                <Icon name="pin" size={16} color="#ffffff" />
              </View>
            </Marker>
          ) : null}
        </MapView>
      </View>

      {hasCoords ? (
        <Text variant="caption" tone="muted">
          {lat.toFixed(5)}, {lng.toFixed(5)} — tap the map or drag the pin to
          adjust.
        </Text>
      ) : (
        <Text variant="caption" tone="muted">
          Tap on the map to drop a pin at the mosque's location.
        </Text>
      )}
    </View>
  );
}
