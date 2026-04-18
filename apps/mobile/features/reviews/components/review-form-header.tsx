import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export function ReviewFormHeader({ mosqueName }: { mosqueName?: string }) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center gap-s-3 px-s-5 py-s-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-pill bg-white"
          hitSlop={8}
        >
          <Icon name="x" size={20} color="#1a2a22" />
        </Pressable>
        <View className="flex-1">
          <Text variant="label" tone="muted">
            Review
          </Text>
          {mosqueName ? (
            <Text variant="title" numberOfLines={1}>
              {mosqueName}
            </Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  )
}
