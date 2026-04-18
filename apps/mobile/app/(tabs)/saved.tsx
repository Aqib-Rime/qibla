import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

export default function SavedScreen() {
  return (
    <Screen bg="cream">
      <View className="flex-1 items-center justify-center">
        <Text variant="display-md">Saved mosques</Text>
        <Text variant="body" tone="muted" className="mt-s-2">
          Your bookmarks will live here.
        </Text>
      </View>
    </Screen>
  )
}
