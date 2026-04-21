import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";
import { MosqueSaveButton } from "./mosque-save-button";

type Props = {
  mosqueId?: string;
  isSaved?: boolean;
};

export function MosqueDetailOverlay({ mosqueId, isSaved }: Props) {
  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 top-0 z-10">
      <SafeAreaView edges={["top"]} pointerEvents="box-none">
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
    </View>
  );
}
