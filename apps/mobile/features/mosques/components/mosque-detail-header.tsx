import { Icon } from "@/components/ui/icon"
import { router } from "expo-router"
import { Pressable, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export function MosqueDetailHeader() {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center justify-between px-s-5 py-s-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-pill bg-white"
          hitSlop={8}
        >
          <Icon name="back" size={20} color="#1a2a22" />
        </Pressable>
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-pill bg-white"
          hitSlop={8}
        >
          <Icon name="heart" size={20} color="#1a2a22" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
