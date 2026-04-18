import { View } from "react-native"

type Props = {
  aligned: boolean
}

export function QiblaTopPointer({ aligned }: Props) {
  return (
    <View
      pointerEvents="none"
      className="absolute top-0 items-center"
      style={{ alignSelf: "center" }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 9,
          borderRightWidth: 9,
          borderTopWidth: 14,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: aligned ? "#2e5d45" : "#1a2a22",
        }}
      />
    </View>
  )
}
