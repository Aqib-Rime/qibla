import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"
import type { Event } from "../lib/types"

export function MosqueEventsTab({ events }: { events: readonly Event[] }) {
  if (!events.length) {
    return (
      <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
        <Text variant="label" tone="muted">
          No upcoming events
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-s-3">
      {events.map((e) => (
        <View
          key={e.id}
          className="flex-row items-start gap-s-3 rounded-md bg-white p-s-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-sm bg-green-tint">
            <Icon name="clock" size={16} color="#2e5d45" />
          </View>
          <View className="flex-1">
            <Text variant="label">{e.title}</Text>
            <Text variant="caption" tone="muted" className="mt-s-1">
              {e.when}
              {e.by ? ` · ${e.by}` : ""}
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}
