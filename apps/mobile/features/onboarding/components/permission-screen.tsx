import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import * as Location from "expo-location"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Pressable, View } from "react-native"
import { markOnboardingCompleted } from "../lib/storage"
import { PermissionBenefits } from "./permission-benefits"
import { PermissionPulse } from "./permission-pulse"

export function PermissionScreen() {
  const router = useRouter()
  const [asking, setAsking] = useState(false)

  const continueToAuth = async () => {
    await markOnboardingCompleted()
    router.replace("/(auth)/sign-in")
  }

  const requestPermission = async () => {
    setAsking(true)
    try {
      await Location.requestForegroundPermissionsAsync()
    } catch {}
    await continueToAuth()
  }

  return (
    <Screen bg="cream">
      <PermissionPulse />

      <Text variant="display-lg" className="mt-s-4 text-center">
        Allow location access
      </Text>
      <Text
        variant="body"
        tone="muted"
        className="mt-s-3 text-center self-center max-w-[300px]"
      >
        Qibla uses your location to show mosques nearby and calculate accurate
        prayer times. You can turn this off anytime.
      </Text>

      <PermissionBenefits />

      <View className="flex-1" />
      <View className="gap-s-2 pb-s-8 pt-s-6">
        <Button
          label="Allow location"
          leading={!asking ? <Icon name="pin" size={16} color="#fff" /> : undefined}
          loading={asking}
          onPress={requestPermission}
        />
        <Pressable onPress={continueToAuth}>
          <Text variant="label" tone="muted" className="text-center py-s-3">
            Not now
          </Text>
        </Pressable>
      </View>
    </Screen>
  )
}
