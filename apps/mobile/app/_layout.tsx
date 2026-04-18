import "../global.css"

import { Providers } from "@/components/providers"
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  useFonts as useGeist,
} from "@expo-google-fonts/geist"
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { SafeAreaProvider } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [fontsLoaded] = useGeist({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    GeistMono_400Regular,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {})
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <Providers>
            <Stack
              screenOptions={{ headerShown: false, animation: "slide_from_right" }}
            >
              <Stack.Screen name="index" options={{ animation: "fade" }} />
              <Stack.Screen name="onboard/1" />
              <Stack.Screen name="onboard/2" />
              <Stack.Screen name="onboard/3" />
              <Stack.Screen name="onboard/permission" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
              <Stack.Screen name="mosque/[id]" />
              <Stack.Screen
                name="review/[mosqueId]"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
            </Stack>
          </Providers>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}
