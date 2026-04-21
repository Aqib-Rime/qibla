import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import type { Imam } from "../lib/types";

export function MosqueImamCard({ imam }: { imam: Imam }) {
  const colors = useThemeColors();
  if (!imam) return null;
  return (
    <View>
      <Text variant="eyebrow" tone="muted">
        Imam
      </Text>
      <View className="mt-s-2 flex-row items-center gap-s-3 rounded-md bg-surface p-s-4">
        <View className="h-11 w-11 items-center justify-center rounded-pill bg-green-tint">
          <Icon name="user" size={20} color={colors.green} />
        </View>
        <View className="flex-1">
          <Text variant="label">{imam.name}</Text>
          <Text variant="caption" tone="muted" className="mt-s-1">
            {imam.role}
            {imam.since ? ` · since ${imam.since}` : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
