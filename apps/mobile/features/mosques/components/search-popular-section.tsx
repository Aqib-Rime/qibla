import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { Position } from "@/lib/use-user-location";
import { formatDistance, haversineKm } from "../lib/distance";
import type { MosqueListItem } from "../lib/types";
import { SearchPopularRow } from "./search-popular-row";

type Props = {
  mosques: readonly MosqueListItem[];
  userPos: Position | null;
};

export function SearchPopularSection({ mosques, userPos }: Props) {
  const popular = useMemo(() => {
    const scored = mosques.map((m) => {
      const distance = userPos
        ? haversineKm(userPos, { lat: m.lat, lng: m.lng })
        : null;
      return { mosque: m, distance };
    });

    const byProximity = userPos
      ? [...scored].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      : [...scored].sort(
          (a, b) => (b.mosque.rating ?? 0) - (a.mosque.rating ?? 0),
        );

    return byProximity.slice(0, 3);
  }, [mosques, userPos]);

  if (!popular.length) return null;

  return (
    <View>
      <Text variant="eyebrow" tone="muted">
        Popular nearby
      </Text>
      <View className="mt-s-3 gap-s-3">
        {popular.map(({ mosque, distance }) => (
          <SearchPopularRow
            key={mosque.id}
            mosque={mosque}
            distanceLabel={
              distance != null ? formatDistance(distance) : undefined
            }
          />
        ))}
      </View>
    </View>
  );
}
