import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useThemeColors } from "@/lib/theme";

type Props = {
  size: number;
};

const TICK_COUNT = 72;

export function QiblaDialFace({ size }: Props) {
  const c = size / 2;
  const outerR = size / 2 - 6;
  const innerR = outerR - 24;
  const colors = useThemeColors();

  const cardinal = [
    { label: "N", angle: 0, tone: colors.danger },
    { label: "E", angle: 90, tone: colors.ink },
    { label: "S", angle: 180, tone: colors.ink },
    { label: "W", angle: 270, tone: colors.ink },
  ] as const;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={c}
        cy={c}
        r={outerR}
        fill={colors.surface}
        stroke={colors.line}
        strokeWidth={1.5}
      />
      <Circle
        cx={c}
        cy={c}
        r={innerR}
        fill="none"
        stroke={colors.line}
        strokeWidth={1}
      />
      <Circle cx={c} cy={c} r={4} fill={colors.ink} />

      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = (i / TICK_COUNT) * 360;
        const major = angle % 30 === 0;
        const length = major ? 12 : 6;
        const rad = ((angle - 90) * Math.PI) / 180;
        const x1 = c + Math.cos(rad) * outerR;
        const y1 = c + Math.sin(rad) * outerR;
        const x2 = c + Math.cos(rad) * (outerR - length);
        const y2 = c + Math.sin(rad) * (outerR - length);
        return (
          <Line
            // biome-ignore lint/suspicious/noArrayIndexKey: static compass dial, tick index is the stable identity
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={major ? colors.ink : colors.line}
            strokeWidth={major ? 1.5 : 1}
          />
        );
      })}

      {cardinal.map(({ label, angle, tone }) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const r = outerR - 34;
        const x = c + Math.cos(rad) * r;
        const y = c + Math.sin(rad) * r;
        return (
          <SvgText
            key={label}
            x={x}
            y={y + 6}
            fontSize={16}
            fontWeight="600"
            fill={tone}
            textAnchor="middle"
          >
            {label}
          </SvgText>
        );
      })}
    </Svg>
  );
}
