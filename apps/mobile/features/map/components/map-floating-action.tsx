import { Icon, type IconName } from "@/components/ui/icon"
import * as Haptics from "expo-haptics"
import { Pressable } from "react-native"

type Props = {
  icon: IconName
  onPress: () => void
  disabled?: boolean
  accessibilityLabel: string
}

const SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 6,
}

export function MapFloatingAction({
  icon,
  onPress,
  disabled,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {})
        onPress()
      }}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      className="h-11 w-11 items-center justify-center rounded-pill bg-white"
      style={({ pressed }) => [
        SHADOW,
        { transform: [{ scale: pressed ? 0.94 : 1 }], opacity: disabled ? 0.5 : 1 },
      ]}
      hitSlop={6}
    >
      <Icon name={icon} size={20} color="#1a2a22" />
    </Pressable>
  )
}
