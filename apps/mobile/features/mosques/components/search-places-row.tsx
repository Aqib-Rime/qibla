import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { usePushRecentPlace } from "../hooks/use-recent-places";

type Props = {
  place: {
    placeId: string;
    name: string;
    address: string | null;
    lat: number;
    lng: number;
    distanceKm?: number;
  };
};

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
}

export function SearchPlacesRow({ place }: Props) {
  const pushRecent = usePushRecentPlace();

  const onPick = () => {
    // Record the pick before navigating so the recent-searches section is
    // up to date the next time the user opens the search modal.
    pushRecent.mutate({
      placeId: place.placeId,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
    });
    router.replace({
      pathname: "/(tabs)/map",
      params: {
        lat: String(place.lat),
        lng: String(place.lng),
        placeName: place.name,
      },
    });
  };

  return (
    <Pressable
      onPress={onPick}
      className="flex-row items-center gap-s-3 rounded-md bg-white p-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
        <Icon name="pin" size={16} color="#2e5d45" />
      </View>
      <View className="flex-1">
        <Text variant="label" numberOfLines={1}>
          {place.name}
        </Text>
        {place.address ? (
          <Text
            variant="caption"
            tone="muted"
            className="mt-s-1"
            numberOfLines={1}
          >
            {place.address}
          </Text>
        ) : null}
      </View>
      {typeof place.distanceKm === "number" ? (
        <Text variant="caption" tone="muted">
          {formatDistance(place.distanceKm)}
        </Text>
      ) : null}
    </Pressable>
  );
}
