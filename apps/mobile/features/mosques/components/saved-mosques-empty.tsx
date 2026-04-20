import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function SavedMosquesEmpty() {
  return (
    <View className="flex-1 items-center justify-center gap-s-3 px-s-5">
      <View className="h-16 w-16 items-center justify-center rounded-pill bg-green-tint">
        <Icon name="heart" size={28} color="#2e5d45" />
      </View>
      <Text variant="display-sm" className="text-center">
        No saved mosques yet
      </Text>
      <Text variant="body" tone="muted" className="text-center max-w-[280px]">
        Tap the heart on any mosque to keep it here for quick access.
      </Text>
      <View className="mt-s-4">
        <Button
          label="Browse mosques"
          onPress={() => router.replace("/(tabs)/map")}
        />
      </View>
    </View>
  );
}
