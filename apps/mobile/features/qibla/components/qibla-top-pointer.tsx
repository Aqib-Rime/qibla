import { View } from "react-native";
import { useThemeColors } from "@/lib/theme";

type Props = {
  aligned: boolean;
};

export function QiblaTopPointer({ aligned }: Props) {
  const colors = useThemeColors();
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
          borderTopColor: aligned ? colors.green : colors.ink,
        }}
      />
    </View>
  );
}
