import { Icon } from "@/components/ui/icon"
import { View } from "react-native"

type Props = {
  size: number
  bearing: number
  aligned: boolean
}

const MARKER_SIZE = 52
const EDGE_INSET = 10

const MARKER_SHADOW = {
  shadowColor: "#2e5d45",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 8,
}

export function QiblaDialMarker({ size, bearing, aligned }: Props) {
  const radius = size / 2 - MARKER_SIZE / 2 - EDGE_INSET
  const rad = ((bearing - 90) * Math.PI) / 180
  const left = size / 2 + Math.cos(rad) * radius - MARKER_SIZE / 2
  const top = size / 2 + Math.sin(rad) * radius - MARKER_SIZE / 2

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: MARKER_SIZE,
        height: MARKER_SIZE,
        ...MARKER_SHADOW,
      }}
      className={`items-center justify-center rounded-pill ${
        aligned ? "bg-green" : "bg-green-dark"
      }`}
    >
      <Icon name="mosque" size={22} color="#ffffff" />
    </View>
  )
}
