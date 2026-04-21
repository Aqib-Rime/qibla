import { View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { MosqueMark } from "@/components/ui/mosque-mark";
import { useThemeColors } from "@/lib/theme";

export function ArtRoute() {
  const colors = useThemeColors();
  return (
    <View className="flex-1 bg-cream">
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 320 340"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          [20, 30, 60, 70],
          [100, 30, 60, 70],
          [180, 30, 60, 70],
          [260, 30, 60, 70],
          [20, 120, 60, 70],
          [180, 120, 60, 70],
          [260, 120, 60, 70],
          [20, 220, 60, 70],
          [100, 220, 60, 70],
          [260, 220, 60, 70],
        ].map(([x, y, w, h]) => (
          <Rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={colors.line}
            stroke={colors.muted}
            strokeWidth="0.8"
            rx="1"
          />
        ))}
        <Path d="M 0 100 L 320 110" stroke={colors.line} strokeWidth="14" />
        <Path d="M 0 100 L 320 110" stroke={colors.surface} strokeWidth="11" />
        <Path d="M 0 200 L 320 210" stroke={colors.line} strokeWidth="14" />
        <Path d="M 0 200 L 320 210" stroke={colors.surface} strokeWidth="11" />
        <Path d="M 160 0 L 170 340" stroke={colors.line} strokeWidth="12" />
        <Path d="M 160 0 L 170 340" stroke={colors.surface} strokeWidth="9" />
        <Path
          d="M 60 280 Q 80 200 160 180 T 250 80"
          stroke={colors.green}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <Circle
          cx="60"
          cy="280"
          r="9"
          fill={colors.white}
          stroke={colors.green}
          strokeWidth="3"
        />
        <Circle cx="60" cy="280" r="3" fill={colors.green} />
      </Svg>
      <View
        className="absolute"
        style={{
          left: "74%",
          top: "18%",
          transform: [{ translateX: -28 }, { translateY: -56 }],
        }}
      >
        <MosqueMark size="md" />
      </View>
    </View>
  );
}
