import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";

type Props = {
  url: string | null;
  onClose: () => void;
};

export function PhotoPreviewModal({ url, onClose }: Props) {
  return (
    <Modal
      visible={url !== null}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
    >
      <View className="flex-1 bg-black">
        <SafeAreaView
          edges={["top"]}
          className="flex-row justify-end px-s-4 py-s-2"
        >
          <Pressable
            onPress={onClose}
            className="h-10 w-10 items-center justify-center rounded-pill bg-black/50"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            accessibilityLabel="Close preview"
          >
            <Icon name="x" size={18} color="#ffffff" />
          </Pressable>
        </SafeAreaView>
        {url ? (
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: url }}
              contentFit="contain"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
