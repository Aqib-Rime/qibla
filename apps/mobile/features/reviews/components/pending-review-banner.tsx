import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

export function PendingReviewBanner() {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-s-3 rounded-md bg-green-tint p-s-4">
      <Icon name="clock" size={18} color={colors.green} />
      <Text variant="body-sm" tone="green" className="flex-1">
        Your review is awaiting moderation — it'll appear here once approved.
      </Text>
    </View>
  );
}
