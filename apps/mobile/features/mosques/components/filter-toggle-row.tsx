import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import * as Haptics from "expo-haptics"
import { Pressable, View } from "react-native"

type Props = {
  icon: IconName
  label: string
  description?: string
  active: boolean
  onToggle: () => void
}

export function FilterToggleRow({
  icon,
  label,
  description,
  active,
  onToggle,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {})
        onToggle()
      }}
      className={`flex-row items-center gap-s-4 rounded-md border bg-white px-s-4 py-s-4 ${
        active ? "border-green" : "border-line"
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View
        className={`h-10 w-10 items-center justify-center rounded-sm ${
          active ? "bg-green" : "bg-green-tint"
        }`}
      >
        <Icon name={icon} size={18} color={active ? "#ffffff" : "#2e5d45"} />
      </View>
      <View className="flex-1">
        <Text variant="label">{label}</Text>
        {description ? (
          <Text variant="caption" tone="muted" className="mt-s-1">
            {description}
          </Text>
        ) : null}
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-sm border ${
          active ? "border-green bg-green" : "border-line bg-white"
        }`}
      >
        {active ? <Icon name="arrow" size={14} color="#ffffff" /> : null}
      </View>
    </Pressable>
  )
}
