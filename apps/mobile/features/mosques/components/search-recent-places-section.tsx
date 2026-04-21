import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  useClearRecentPlaces,
  useRecentPlaces,
} from "../hooks/use-recent-places";
import type { RecentPlace } from "../lib/recent-places-storage";

const MAX_DISPLAY = 5;

export function SearchRecentPlacesSection() {
  const recent = useRecentPlaces();
  const clear = useClearRecentPlaces();
  const places = (recent.data ?? []).slice(0, MAX_DISPLAY);

  if (places.length === 0) return null;

  return (
    <View className="gap-s-3">
      <View className="flex-row items-center justify-between">
        <Text variant="eyebrow" tone="muted">
          Recent searches
        </Text>
        <Pressable
          onPress={() => clear.mutate()}
          disabled={clear.isPending}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text variant="caption" tone="muted">
            Clear
          </Text>
        </Pressable>
      </View>

      <View className="gap-s-2">
        {places.map((p) => (
          <RecentPlaceRow key={p.placeId} place={p} />
        ))}
      </View>
    </View>
  );
}

function RecentPlaceRow({ place }: { place: RecentPlace }) {
  const onPick = () => {
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
      <View className="h-9 w-9 items-center justify-center rounded-sm bg-cream">
        <Icon name="clock" size={14} color="#6b7a70" />
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
      <Icon name="chevron" size={14} color="#6b7a70" />
    </Pressable>
  );
}
