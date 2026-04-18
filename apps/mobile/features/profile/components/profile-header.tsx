import { IconButton } from "@/components/ui/icon-button"
import { Text } from "@/components/ui/text"
import { router } from "expo-router"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export function ProfileHeader() {
  const canGoBack = router.canGoBack()

  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center justify-between px-s-5 py-s-2">
        {canGoBack ? (
          <IconButton
            icon="back"
            size="sm"
            variant="ghost"
            onPress={() => router.back()}
            accessibilityLabel="Back"
          />
        ) : (
          <View className="h-10 w-10" />
        )}
        <Text variant="display-sm">Profile</Text>
        <View className="h-10 w-10" />
      </View>
    </SafeAreaView>
  )
}
