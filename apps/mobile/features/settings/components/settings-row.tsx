import { Pressable, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

type Props = {
  icon: IconName;
  label: string;
  right?: string;
  onPress?: () => void;
  isLast?: boolean;
};

export function SettingsRow({ icon, label, right, onPress, isLast }: Props) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center gap-s-3 px-s-4 py-s-3 ${
        isLast ? "" : "border-b border-line"
      }`}
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.7 : 1 })}
    >
      <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
        <Icon name={icon} size={15} color={colors.green} />
      </View>
      <Text variant="body" className="flex-1">
        {label}
      </Text>
      {right ? (
        <Text variant="body-sm" tone="muted">
          {right}
        </Text>
      ) : null}
      <Icon name="chevron" size={14} color={colors.muted} />
    </Pressable>
  );
}
