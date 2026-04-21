import { View } from "react-native";
import { Text } from "@/components/ui/text";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  return (
    <View className="mt-s-6">
      <Text variant="eyebrow" tone="muted">
        {title}
      </Text>
      <View className="mt-s-2 overflow-hidden rounded-lg border border-line/80 bg-surface">
        {children}
      </View>
    </View>
  );
}
