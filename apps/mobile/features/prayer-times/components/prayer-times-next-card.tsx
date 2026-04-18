import { Text } from "@/components/ui/text"
import { View } from "react-native"
import { formatTime12, PRAYER_LABEL, type PrayerName } from "../lib/prayer"

type Props = {
  name: PrayerName
  time: string
  tomorrow: boolean
}

export function PrayerTimesNextCard({ name, time, tomorrow }: Props) {
  return (
    <View className="rounded-md bg-green p-s-5">
      <Text variant="eyebrow" tone="white-muted">
        {tomorrow ? "Tomorrow · Fajr" : "Next prayer"}
      </Text>
      <View className="mt-s-2 flex-row items-end justify-between">
        <Text variant="display-md" tone="white">
          {PRAYER_LABEL[name]}
        </Text>
        <Text variant="display-md" tone="white">
          {formatTime12(time)}
        </Text>
      </View>
    </View>
  )
}
