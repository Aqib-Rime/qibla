import { View } from "react-native";
import { Text } from "@/components/ui/text";

type Stat = { value: string | number; label: string };

export function ProfileStats({ stats }: { stats: Stat[] }) {
  return (
    <View className="mt-s-3 flex-row gap-s-2">
      {stats.map((s) => (
        <View
          key={s.label}
          className="flex-1 items-center rounded-md border border-line/80 bg-surface py-s-3"
        >
          <Text variant="display-md" className="font-mono">
            {s.value}
          </Text>
          <Text variant="caption" tone="muted" className="mt-s-1">
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
