import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import * as Location from "expo-location"
import { useState } from "react"
import { View } from "react-native"

type Props = {
  onGranted: () => void
}

export function QiblaLocationGate({ onGranted }: Props) {
  const [asking, setAsking] = useState(false)

  const request = async () => {
    setAsking(true)
    try {
      const result = await Location.requestForegroundPermissionsAsync()
      if (result.status === "granted") onGranted()
    } catch {}
    setAsking(false)
  }

  return (
    <View className="flex-1 items-center justify-center gap-s-4 px-s-6">
      <View className="h-16 w-16 items-center justify-center rounded-pill bg-green-tint">
        <Icon name="recenter" size={28} color="#2e5d45" />
      </View>
      <Text variant="display-sm" className="text-center">
        Enable location for Qibla
      </Text>
      <Text variant="body" tone="muted" className="max-w-[300px] text-center">
        We need your position to point to Mecca accurately. Your location stays
        on the device.
      </Text>
      <Button
        label="Allow location"
        leading={<Icon name="pin" size={16} color="#ffffff" />}
        onPress={request}
        loading={asking}
      />
    </View>
  )
}
