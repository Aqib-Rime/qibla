import { Alert, Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  place: {
    placeId: string;
    name: string;
    address: string | null;
    distanceKm?: number;
  };
};

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
}

export function SearchPlacesRow({ place }: Props) {
  const onSuggest = () => {
    Alert.alert(
      "Suggest this mosque",
      `${place.name} isn't in Qibla yet. We'll review and add it soon — thanks for flagging it.`,
      [{ text: "OK", style: "default" }],
    );
  };

  return (
    <Pressable
      onPress={onSuggest}
      className="flex-row items-center gap-s-3 rounded-md border border-dashed border-line bg-white p-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-sm bg-[#f4ead0]">
        <Icon name="pin" size={16} color="#8a6a1f" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-s-2">
          <Text variant="label" numberOfLines={1} className="flex-1">
            {place.name}
          </Text>
          <View className="rounded-sm bg-[#f4ead0] px-s-2 py-s-1">
            <Text variant="caption" tone="muted" className="text-[10px]">
              GOOGLE
            </Text>
          </View>
        </View>
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
