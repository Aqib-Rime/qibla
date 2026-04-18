import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { Switch, View } from "react-native"

type Props = {
  icon: IconName
  label: string
  description?: string
  value: boolean
  onValueChange: (v: boolean) => void
  disabled?: boolean
  isLast?: boolean
}

export function SettingsToggleRow({
  icon,
  label,
  description,
  value,
  onValueChange,
  disabled,
  isLast,
}: Props) {
  return (
    <View
      className={`flex-row items-center gap-s-3 px-s-4 py-s-3 ${
        isLast ? "" : "border-b border-line"
      }`}
    >
      <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
        <Icon name={icon} size={15} color="#2e5d45" />
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
        trackColor={{ false: "#d7ddd4", true: "#2e5d45" }}
        thumbColor="#ffffff"
        ios_backgroundColor="#d7ddd4"
      />
    </View>
  )
}
