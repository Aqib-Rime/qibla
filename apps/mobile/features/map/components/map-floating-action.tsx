import { View } from "react-native";
import type { IconName } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";

type Props = {
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  badgeCount?: number;
};

export function MapFloatingAction({
  icon,
  onPress,
  disabled,
  accessibilityLabel,
  badgeCount,
}: Props) {
  const button = (
    <IconButton
      icon={icon}
      size="md"
      shape="square"
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
    />
  );

  if (!badgeCount || badgeCount <= 0) return button;

  return (
    <View>
      {button}
      <View className="absolute -right-1.5 -top-1.5 h-5 min-w-[20px] items-center justify-center rounded-pill bg-green px-s-1">
        <Text variant="caption" tone="white" className="text-[11px]">
          {badgeCount}
        </Text>
      </View>
    </View>
  );
}
