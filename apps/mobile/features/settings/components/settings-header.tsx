import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

export function SettingsHeader() {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center justify-between px-s-5 py-s-2">
        <IconButton
          icon="back"
          size="sm"
          variant="ghost"
          onPress={() => router.back()}
          accessibilityLabel="Back"
        />
        <Text variant="display-sm">Settings</Text>
        <View className="h-10 w-10" />
      </View>
    </SafeAreaView>
  );
}
