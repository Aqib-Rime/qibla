import { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import { QiblaDialFace } from "./qibla-dial-face"
import { QiblaDialMarker } from "./qibla-dial-marker"
import { QiblaTopPointer } from "./qibla-top-pointer"

type Props = {
  /** Device heading in degrees (0 = facing north). */
  heading: number
  /** Absolute qibla bearing from user's location (0..360, N = 0). */
  qiblaBearing: number
  /** True when the user is close enough to facing qibla for a success state. */
  aligned: boolean
  size?: number
}

/**
 * Keeps an unwrapped running angle so Animated interpolation never takes the
 * long way around 0°/360°.
 */
function unwrap(previous: number, target: number): number {
  const diff = ((target - previous + 540) % 360) - 180
  return previous + diff
}

export function QiblaDial({
  heading,
  qiblaBearing,
  aligned,
  size = 280,
}: Props) {
  // Dial rotates opposite to device so N stays pointing to real-world north.
  const target = -heading
  const rotationRef = useRef(new Animated.Value(target))
  const unwrappedRef = useRef(target)

  useEffect(() => {
    const next = unwrap(unwrappedRef.current, target)
    unwrappedRef.current = next
    rotationRef.current.setValue(next)
  }, [target])

  const rotate = rotationRef.current.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Animated.View
        className="absolute items-center justify-center"
        style={{
          width: size,
          height: size,
          transform: [{ rotate }],
        }}
      >
        <QiblaDialFace size={size} />
        <QiblaDialMarker
          size={size}
          bearing={qiblaBearing}
          aligned={aligned}
        />
      </Animated.View>
      <QiblaTopPointer aligned={aligned} />
    </View>
  )
}
