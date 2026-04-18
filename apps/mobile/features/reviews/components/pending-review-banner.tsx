import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

export function PendingReviewBanner() {
  return (
    <View className="flex-row items-center gap-s-3 rounded-md bg-green-tint p-s-4">
      <Icon name="clock" size={18} color="#2e5d45" />
      <Text variant="body-sm" tone="green" className="flex-1">
        Your review is awaiting moderation — it'll appear here once approved.
      </Text>
    </View>
  )
}
