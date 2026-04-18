import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import type { MosqueListItem } from "../lib/types"

export function SearchResultRow({ mosque }: { mosque: MosqueListItem }) {
  return (
    <Pressable
      onPress={() => router.replace(`/mosque/${mosque.id}`)}
      className="flex-row items-center gap-s-3 rounded-md bg-white p-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
        <Icon name="pin" size={16} color="#2e5d45" />
      </View>
      <View className="flex-1">
        <Text variant="label" numberOfLines={1}>
          {mosque.name}
        </Text>
        {mosque.area ? (
          <Text variant="caption" tone="muted" className="mt-s-1" numberOfLines={1}>
            {mosque.area}
          </Text>
        ) : null}
      </View>
      {typeof mosque.rating === "number" ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="star" size={12} color="#b68a3c" />
          <Text variant="caption">{mosque.rating.toFixed(1)}</Text>
        </View>
      ) : null}
    </Pressable>
  )
}
