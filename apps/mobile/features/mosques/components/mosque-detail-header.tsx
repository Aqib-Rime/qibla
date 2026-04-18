import { IconButton } from "@/components/ui/icon-button"
import { router } from "expo-router"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { MosqueSaveButton } from "./mosque-save-button"

type Props = {
  mosqueId?: string
  isSaved?: boolean
}

export function MosqueDetailHeader({ mosqueId, isSaved }: Props) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center justify-between px-s-5 py-s-3">
        <IconButton
          icon="back"
          onPress={() => router.back()}
          accessibilityLabel="Back"
        />
        {mosqueId ? (
          <MosqueSaveButton mosqueId={mosqueId} isSaved={isSaved ?? false} />
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>
    </SafeAreaView>
  )
}
