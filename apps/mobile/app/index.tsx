import { MosqueMark } from "@/components/ui/mosque-mark"
import { Text } from "@/components/ui/text"
import { authClient } from "@/lib/auth"
import { hasCompletedOnboarding } from "@/lib/onboarding"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useRef } from "react"
import { ActivityIndicator, Animated, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const MIN_SPLASH_MS = 900

export default function SplashScreenRoute() {
  const router = useRouter()
  const scale = useRef(new Animated.Value(1)).current
  const ring = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    ).start()
    Animated.loop(
      Animated.timing(ring, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      })
    ).start()
  }, [scale, ring])

  useEffect(() => {
    let cancelled = false
    const start = Date.now()

    ;(async () => {
      const [sessionResult, onboarded] = await Promise.all([
        authClient.getSession().catch(() => null),
        hasCompletedOnboarding(),
      ])

      const elapsed = Date.now() - start
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise((r) => setTimeout(r, MIN_SPLASH_MS - elapsed))
      }

      if (cancelled) return

      const hasSession = !!sessionResult?.data?.user
      if (hasSession) {
        router.replace("/(tabs)/map")
      } else if (onboarded) {
        router.replace("/(auth)/sign-in")
      } else {
        router.replace("/onboard/1")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.3] })
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] })

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-dark">
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <View className="relative">
              <Animated.View
                className="absolute inset-0"
                style={{
                  transform: [{ scale: ringScale }],
                  opacity: ringOpacity,
                }}
              >
                <View className="h-[116px] w-[116px] rounded-xl border border-gold/30" />
              </Animated.View>
              <Animated.View
                style={{ transform: [{ scale }] }}
                className="items-center justify-center"
              >
                <MosqueMark size="xl" />
              </Animated.View>
            </View>
            <Text variant="display-lg" tone="white" className="mt-s-6">
              Qibla
            </Text>
            <Text variant="caption" tone="white-muted" className="mt-s-1">
              FIND YOUR NEXT SALAH
            </Text>
          </View>
        </View>
        <View className="pb-s-8 items-center">
          <ActivityIndicator size="small" color="rgba(255,255,255,0.4)" />
        </View>
      </SafeAreaView>
    </>
  )
}
