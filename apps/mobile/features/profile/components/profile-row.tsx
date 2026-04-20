import { Pressable, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  icon: IconName;
  label: string;
  right?: string;
  onPress?: () => void;
  isLast?: boolean;
};

export function ProfileRow({ icon, label, right, onPress, isLast }: Props) {
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
        <Icon name={icon} size={15} color="#2e5d45" />
      </View>
      <Text variant="body" className="flex-1">
        {label}
      </Text>
      {right ? (
        <Text variant="body-sm" tone="muted">
          {right}
        </Text>
      ) : null}
      <Icon name="chevron" size={14} color="#6b7a70" />
    </Pressable>
  );
}
