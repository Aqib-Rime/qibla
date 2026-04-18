import { Button } from "@/components/ui/button"
import { Icon, type IconName } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { markOnboardingCompleted } from "@/lib/onboarding"
import * as Location from "expo-location"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Animated, Pressable, View } from "react-native"

const BENEFITS: { icon: IconName; label: string }[] = [
  { icon: "pin", label: "Nearby mosques on the map" },
  { icon: "clock", label: "Prayer times for your area" },
  { icon: "navigation", label: "Walking and driving routes" },
]

export default function PermissionScreen() {
  const router = useRouter()
  const [asking, setAsking] = useState(false)
  const ring1 = useRef(new Animated.Value(0)).current
  const ring2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.timing(ring1, { toValue: 1, duration: 2400, useNativeDriver: true })
    )
    const loop2 = Animated.loop(
      Animated.timing(ring2, { toValue: 1, duration: 2400, useNativeDriver: true })
    )
    loop1.start()
    const t = setTimeout(() => loop2.start(), 400)
    return () => {
      loop1.stop()
      loop2.stop()
      clearTimeout(t)
    }
  }, [ring1, ring2])

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

  const ringStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.2] }),
      },
    ],
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] }),
  })

  return (
    <Screen bg="cream">
      <View className="items-center justify-center pt-s-7" style={{ height: 240 }}>
        <Animated.View
          className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-line"
          style={ringStyle(ring1)}
        />
        <Animated.View
          className="absolute h-[160px] w-[160px] rounded-full border border-dashed border-line"
          style={ringStyle(ring2)}
        />
        <View className="absolute h-[100px] w-[100px] rounded-full bg-green-tint" />
        <View
          className="h-16 w-16 items-center justify-center rounded-lg bg-green"
          style={{
            shadowColor: "#2e5d45",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.28,
            shadowRadius: 28,
            elevation: 12,
          }}
        >
          <Icon name="pin" size={30} color="#fff" />
        </View>
      </View>

      <Text variant="display-lg" className="mt-s-4 text-center">
        Allow location access
      </Text>
      <Text variant="body" tone="muted" className="mt-s-3 text-center self-center max-w-[300px]">
        Qibla uses your location to show mosques nearby and calculate accurate prayer times. You can turn this off anytime.
      </Text>

      <View className="mt-s-7 gap-s-2">
        {BENEFITS.map((b) => (
          <View
            key={b.label}
            className="flex-row items-center gap-s-3 rounded-md border border-line bg-white px-s-4 py-s-3"
          >
            <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
              <Icon name={b.icon} size={16} color="#2e5d45" />
            </View>
            <Text variant="body" className="flex-1">
              {b.label}
            </Text>
          </View>
        ))}
      </View>

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
