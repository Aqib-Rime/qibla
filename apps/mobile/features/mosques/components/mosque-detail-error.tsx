import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function MosqueDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-s-3 px-s-6">
      <Icon name="alert" size={32} color="#6b7a70" />
      <Text variant="body" tone="muted" className="text-center">
        Could not load this mosque.
      </Text>
      <Pressable onPress={onRetry}>
        <Text variant="label" tone="green">
          Retry
        </Text>
      </Pressable>
    </View>
  );
}
