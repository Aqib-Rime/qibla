import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

export function QiblaSensorError() {
  return (
    <View className="flex-1 items-center justify-center gap-s-3 px-s-6">
      <Icon name="alert" size={32} color="#6b7a70" />
      <Text variant="display-sm" className="text-center">
        Compass unavailable
      </Text>
      <Text variant="body" tone="muted" className="max-w-[300px] text-center">
        This device doesn't expose a magnetometer, or the sensor is disabled.
        We still show the bearing to Mecca from your location.
      </Text>
    </View>
  )
}
