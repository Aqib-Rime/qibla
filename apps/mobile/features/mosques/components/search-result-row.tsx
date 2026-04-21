import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import type { MosqueListItem } from "../lib/types";

export function SearchResultRow({ mosque }: { mosque: MosqueListItem }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => router.replace(`/mosque/${mosque.id}`)}
      className="flex-row items-center gap-s-3 rounded-md bg-surface p-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
        <Icon name="pin" size={16} color={colors.green} />
      </View>
      <View className="flex-1">
        <Text variant="label" numberOfLines={1}>
          {mosque.name}
        </Text>
        {mosque.area ? (
          <Text
            variant="caption"
            tone="muted"
            className="mt-s-1"
            numberOfLines={1}
          >
            {mosque.area}
          </Text>
        ) : null}
      </View>
      {typeof mosque.rating === "number" ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="star" size={12} color={colors.gold} />
          <Text variant="caption">{mosque.rating.toFixed(1)}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}
