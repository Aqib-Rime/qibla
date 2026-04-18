import { IconButton } from "@/components/ui/icon-button"
import { Text } from "@/components/ui/text"
import { router } from "expo-router"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  activeCount: number
}

export function FilterModalHeader({ activeCount }: Props) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center gap-s-3 px-s-5 py-s-3">
        <IconButton
          icon="x"
          onPress={() => router.back()}
          accessibilityLabel="Close filters"
        />
        <View className="flex-1">
          <Text variant="title">Filters</Text>
          <Text variant="caption" tone="muted">
            {activeCount
              ? `${activeCount} active`
              : "Narrow down the mosques shown on the map"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
