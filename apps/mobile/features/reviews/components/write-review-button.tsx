import { router } from "expo-router";
import { Pressable } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

export function WriteReviewButton({ mosqueId }: { mosqueId: string }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => router.push(`/review/${mosqueId}`)}
      className="flex-row items-center justify-center gap-s-2 rounded-md border border-dashed border-line bg-surface py-s-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Icon name="pencil" size={16} color={colors.green} />
      <Text variant="label" tone="green">
        Write a review
      </Text>
    </Pressable>
  );
}
