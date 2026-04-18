import Svg, { Circle, Line, Text as SvgText } from "react-native-svg"

type Props = {
  size: number
}

const TICK_COUNT = 72
const CARDINAL = [
  { label: "N", angle: 0, tone: "#b42318" },
  { label: "E", angle: 90, tone: "#1a2a22" },
  { label: "S", angle: 180, tone: "#1a2a22" },
  { label: "W", angle: 270, tone: "#1a2a22" },
] as const

export function QiblaDialFace({ size }: Props) {
  const c = size / 2
  const outerR = size / 2 - 6
  const innerR = outerR - 24

  return (
    <Svg width={size} height={size}>
      <Circle cx={c} cy={c} r={outerR} fill="#fffbf1" stroke="#e6e0cc" strokeWidth={1.5} />
      <Circle cx={c} cy={c} r={innerR} fill="none" stroke="#ece3c9" strokeWidth={1} />
      <Circle cx={c} cy={c} r={4} fill="#1a2a22" />

      {Array.from({ length: TICK_COUNT }).map((_, i) => {
        const angle = (i / TICK_COUNT) * 360
        const major = angle % 30 === 0
        const length = major ? 12 : 6
        const rad = ((angle - 90) * Math.PI) / 180
        const x1 = c + Math.cos(rad) * outerR
        const y1 = c + Math.sin(rad) * outerR
        const x2 = c + Math.cos(rad) * (outerR - length)
        const y2 = c + Math.sin(rad) * (outerR - length)
        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={major ? "#1a2a22" : "#c5c0ad"}
            strokeWidth={major ? 1.5 : 1}
          />
        )
      })}

      {CARDINAL.map(({ label, angle, tone }) => {
        const rad = ((angle - 90) * Math.PI) / 180
        const r = outerR - 34
        const x = c + Math.cos(rad) * r
        const y = c + Math.sin(rad) * r
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
        )
      })}
    </Svg>
  )
}
