import { View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

const BENEFITS: { icon: IconName; label: string }[] = [
  { icon: "pin", label: "Nearby mosques on the map" },
  { icon: "clock", label: "Prayer times for your area" },
  { icon: "directions", label: "Walking and driving routes" },
];

export function PermissionBenefits() {
  const colors = useThemeColors();
  return (
    <View className="mt-s-7 gap-s-2">
      {BENEFITS.map((b) => (
        <View
          key={b.label}
          className="flex-row items-center gap-s-3 rounded-md border border-line bg-surface px-s-4 py-s-3"
        >
          <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
            <Icon name={b.icon} size={16} color={colors.green} />
          </View>
          <Text variant="body" className="flex-1">
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
