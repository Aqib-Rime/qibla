import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import type { MosqueListItem } from "../lib/types";

type Props = {
  mosque: MosqueListItem;
  distanceLabel?: string;
};

export function SearchPopularRow({ mosque, distanceLabel }: Props) {
  const colors = useThemeColors();
  const cardShadow = {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  };
  return (
    <Pressable
      onPress={() => router.replace(`/mosque/${mosque.id}`)}
      className="flex-row items-center gap-s-4 rounded-md border border-line/80 bg-surface p-s-4"
      style={({ pressed }) => [cardShadow, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View className="h-14 w-14 items-center justify-center rounded-md bg-green-tint">
        <Icon name="mosque" size={24} color={colors.green} />
      </View>
      <View className="flex-1 gap-s-1">
        <Text variant="title" numberOfLines={1}>
          {mosque.name}
        </Text>
        <View className="flex-row items-center gap-s-2">
          {typeof mosque.rating === "number" ? (
            <>
              <View className="flex-row items-center gap-s-1">
                <Icon name="star" size={12} color={colors.gold} />
                <Text variant="caption">{mosque.rating.toFixed(1)}</Text>
              </View>
              <Text variant="caption" tone="muted">
                ·
              </Text>
            </>
          ) : null}
          {distanceLabel ? (
            <>
              <Text variant="caption" tone="muted">
                {distanceLabel}
              </Text>
              <Text variant="caption" tone="muted">
                ·
              </Text>
            </>
          ) : null}
          <View className="flex-row items-center gap-s-1">
            <View
              className={`h-1.5 w-1.5 rounded-pill ${mosque.open ? "bg-green" : "bg-muted"}`}
            />
            <Text variant="caption" tone={mosque.open ? "green" : "muted"}>
              {mosque.open ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
      </View>
      <Icon name="chevron" size={18} color={colors.muted} />
    </Pressable>
  );
}
