import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export function QiblaHeader() {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center justify-between px-s-5 py-s-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          className="p-s-2"
          accessibilityLabel="Back"
        >
          <Icon name="back" size={22} color="#1a2a22" />
        </Pressable>
        <Text variant="display-sm">Qibla</Text>
        <View className="h-10 w-10" />
      </View>
    </SafeAreaView>
  )
}
