import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

export function ReviewFormHeader({ mosqueName }: { mosqueName?: string }) {
  return (
    <SafeAreaView edges={["top"]} className="bg-cream">
      <View className="flex-row items-center gap-s-3 px-s-5 py-s-3">
        <IconButton
          icon="x"
          onPress={() => router.back()}
          accessibilityLabel="Close"
        />
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
  );
}
