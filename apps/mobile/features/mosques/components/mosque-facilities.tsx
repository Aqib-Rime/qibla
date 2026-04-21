import { useMemo } from "react";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { resolveFacilities } from "../lib/facilities";

export function MosqueFacilities({
  facilities,
}: {
  facilities: readonly string[];
}) {
  const resolved = useMemo(() => resolveFacilities(facilities), [facilities]);
  const colors = useThemeColors();
  if (!resolved.length) return null;

  return (
    <View>
      <Text variant="eyebrow" tone="muted">
        Facilities
      </Text>
      <View className="mt-s-2 flex-row flex-wrap gap-s-2">
        {resolved.map((f) => (
          <View
            key={f.key}
            className="flex-row items-center gap-s-2 rounded-pill bg-surface px-s-4 py-s-2"
          >
            <Icon name={f.meta.icon} size={14} color={colors.green} />
            <Text variant="caption">{f.meta.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
