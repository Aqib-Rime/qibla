import { Text } from "@/components/ui/text"
import { StatusBar } from "expo-status-bar"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSplashRouting } from "../hooks/use-splash-routing"
import { SplashPulseLogo } from "./splash-pulse-logo"

export function SplashScreen() {
  useSplashRouting()

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1 bg-dark">
        <View className="flex-1 items-center justify-center">
          <View className="items-center">
            <SplashPulseLogo />
            <Text variant="display-lg" tone="white" className="mt-s-6">
              Qibla
            </Text>
            <Text variant="caption" tone="white-muted" className="mt-s-1">
              FIND YOUR NEXT SALAH
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
