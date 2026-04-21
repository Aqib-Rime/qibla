import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";

const MARGIN = 20;

export function MapAddFab() {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute"
      style={{
        right: MARGIN,
        bottom: insets.bottom + MARGIN,
      }}
    >
      <IconButton
        icon="plus"
        size="xl"
        shape="pill"
        variant="filled"
        accessibilityLabel="Submit a mosque"
        onPress={() => router.push("/submit")}
      />
    </View>
  );
}
