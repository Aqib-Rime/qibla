import { Icon } from "@/components/ui/icon"
import { useEffect, useRef } from "react"
import { Animated, View } from "react-native"

const ringStyle = (anim: Animated.Value) => ({
  transform: [
    {
      scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.2] }),
    },
  ],
  opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 0] }),
})

export function PermissionPulse() {
  const ring1 = useRef(new Animated.Value(0)).current
  const ring2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.timing(ring1, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    )
    const loop2 = Animated.loop(
      Animated.timing(ring2, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    )
    loop1.start()
    const t = setTimeout(() => loop2.start(), 400)
    return () => {
      loop1.stop()
      loop2.stop()
      clearTimeout(t)
    }
  }, [ring1, ring2])

  return (
    <View
      className="items-center justify-center pt-s-7"
      style={{ height: 240 }}
    >
      <Animated.View
        className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-line"
        style={ringStyle(ring1)}
      />
      <Animated.View
        className="absolute h-[160px] w-[160px] rounded-full border border-dashed border-line"
        style={ringStyle(ring2)}
      />
      <View className="absolute h-[100px] w-[100px] rounded-full bg-green-tint" />
      <View
        className="h-16 w-16 items-center justify-center rounded-lg bg-green"
        style={{
          shadowColor: "#2e5d45",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.28,
          shadowRadius: 28,
          elevation: 12,
        }}
      >
        <Icon name="pin" size={30} color="#fff" />
      </View>
    </View>
  )
}
