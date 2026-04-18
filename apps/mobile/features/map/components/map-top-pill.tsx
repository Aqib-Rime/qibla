import { Icon } from "@/components/ui/icon"
import { Skeleton } from "@/components/ui/skeleton"
import { Text } from "@/components/ui/text"
import {
  formatTime12,
  nextPrayer,
  PRAYER_LABEL,
  type Timings,
} from "@/features/prayer-times"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  mosqueCount: number
  mosquesLoading: boolean
  mosquesError: boolean
  timings: Timings | null
  onRetry: () => void
}

const PILL_SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 6,
}

export function MapTopPill({
  mosqueCount,
  mosquesLoading,
  mosquesError,
  timings,
  onRetry,
}: Props) {
  const next = timings ? nextPrayer(timings) : null

  const title = next
    ? `${next.tomorrow ? "Tomorrow · " : ""}${PRAYER_LABEL[next.name]} · ${formatTime12(next.time)}`
    : mosquesLoading
      ? null
      : mosquesError
        ? "Could not load mosques"
        : `${mosqueCount} mosques nearby`

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      pointerEvents="box-none"
      className="absolute left-0 right-0 top-0"
    >
      <View
        className="mx-s-5 mt-s-3 flex-row items-center gap-s-3 rounded-md bg-white px-s-4 py-s-3"
        style={PILL_SHADOW}
      >
        <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
          <Icon name="clock" size={16} color="#2e5d45" />
        </View>
        <View className="flex-1">
          {title ? (
            <Text variant="label" tone="ink">
              {title}
            </Text>
          ) : (
            <Skeleton className="h-4 w-32 rounded-sm" />
          )}
          <Text variant="caption" tone="muted">
            Tap a pin for details
          </Text>
        </View>
        {mosquesError ? (
          <Pressable onPress={onRetry}>
            <Text variant="label" tone="green">
              Retry
            </Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  )
}
