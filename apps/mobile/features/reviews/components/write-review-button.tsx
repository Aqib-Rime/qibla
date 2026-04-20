import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function WriteReviewButton({ mosqueId }: { mosqueId: string }) {
  return (
    <Pressable
      onPress={() => router.push(`/review/${mosqueId}`)}
      className="flex-row items-center justify-center gap-s-2 rounded-md border border-dashed border-line bg-white py-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Icon name="pencil" size={16} color="#2e5d45" />
      <Text variant="label" tone="green">
        Write a review
      </Text>
    </Pressable>
  );
}
