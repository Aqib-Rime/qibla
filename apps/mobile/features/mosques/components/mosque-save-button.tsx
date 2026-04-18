import { Icon } from "@/components/ui/icon"
import * as Haptics from "expo-haptics"
import { Pressable } from "react-native"
import { useToggleSaved } from "../hooks/use-mosques"

type Props = {
  mosqueId: string
  isSaved: boolean
}

export function MosqueSaveButton({ mosqueId, isSaved }: Props) {
  const toggle = useToggleSaved()

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    toggle.mutate({ mosqueId, save: !isSaved })
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={toggle.isPending}
      className="h-10 w-10 items-center justify-center rounded-pill bg-white"
      hitSlop={8}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.92 : 1 }],
      })}
    >
      <Icon
        name="heart"
        size={20}
        color={isSaved ? "#b42318" : "#1a2a22"}
        fill={isSaved ? "#b42318" : "none"}
      />
    </Pressable>
  )
}
