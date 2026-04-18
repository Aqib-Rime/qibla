import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { Imam } from "../lib/types"

export function MosqueImamCard({ imam }: { imam: Imam }) {
  if (!imam) return null
  return (
    <View>
      <Text variant="eyebrow" tone="muted">
        Imam
      </Text>
      <View className="mt-s-2 flex-row items-center gap-s-3 rounded-md bg-white p-s-4">
        <View className="h-11 w-11 items-center justify-center rounded-pill bg-green-tint">
          <Icon name="user" size={20} color="#2e5d45" />
        </View>
        <View className="flex-1">
          <Text variant="label">{imam.name}</Text>
          <Text variant="caption" tone="muted" className="mt-s-1">
            {imam.role}
            {imam.since ? ` · since ${imam.since}` : ""}
          </Text>
        </View>
      </View>
    </View>
  )
}
