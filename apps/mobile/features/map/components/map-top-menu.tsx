import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import * as Haptics from "expo-haptics"
import { router } from "expo-router"
import { Pressable, View } from "react-native"

type MenuItem = {
  label: string
  icon: IconName
  onPress: () => void
}

const MENU_SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.18,
  shadowRadius: 24,
  elevation: 10,
}

export function MapTopMenu({ onClose }: { onClose: () => void }) {
  const items: MenuItem[] = [
    {
      label: "Find Qibla",
      icon: "compass",
      onPress: () => {
        onClose()
        router.push("/qibla")
      },
    },
    {
      label: "Saved mosques",
      icon: "heart",
      onPress: () => {
        onClose()
        router.push("/(tabs)/saved")
      },
    },
    {
      label: "Profile",
      icon: "user",
      onPress: () => {
        onClose()
        router.push("/(tabs)/profile")
      },
    },
  ]

  return (
    <View
      className="absolute right-0 top-full mt-s-2 min-w-[200px] rounded-md border border-line/80 bg-white py-s-2"
      style={MENU_SHADOW}
    >
      {items.map((it) => (
        <Pressable
          key={it.label}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {})
            it.onPress()
          }}
          className="flex-row items-center gap-s-3 px-s-4 py-s-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Icon name={it.icon} size={18} color="#1a2a22" />
          <Text variant="label">{it.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}
