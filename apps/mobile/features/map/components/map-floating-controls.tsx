import { View } from "react-native"
import { MapFloatingAction } from "./map-floating-action"

type Props = {
  onRecenter: () => void
  canRecenter: boolean
}

export function MapFloatingControls({ onRecenter, canRecenter }: Props) {
  return (
    <View
      pointerEvents="box-none"
      className="absolute right-s-5 top-s-10 mt-s-10 gap-s-3"
    >
      <MapFloatingAction
        icon="navigation"
        onPress={onRecenter}
        disabled={!canRecenter}
        accessibilityLabel="Recenter on my location"
      />
    </View>
  )
}
