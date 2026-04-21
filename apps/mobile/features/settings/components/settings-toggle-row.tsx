import { Switch, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

type Props = {
  icon: IconName;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
};

export function SettingsToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
  disabled,
  isLast,
}: Props) {
  const colors = useThemeColors();
  return (
    <View
      className={`flex-row items-center gap-s-3 px-s-4 py-s-3 ${
        isLast ? "" : "border-b border-line"
      }`}
    >
      <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
        <Icon name={icon} size={15} color={colors.green} />
      </View>
      <View className="flex-1">
        <Text variant="body">{label}</Text>
        {description ? (
          <Text variant="caption" tone="muted">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.switchTrackOff, true: colors.green }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.switchTrackOff}
      />
    </View>
  );
}
