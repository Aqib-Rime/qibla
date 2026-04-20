import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { MosqueMark } from "@/components/ui/mosque-mark";

export function SplashPulseLogo() {
  const scale = useRef(new Animated.Value(1)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    Animated.loop(
      Animated.timing(ring, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
    ).start();
  }, [scale, ring]);

  const ringScale = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.3],
  });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  return (
    <View className="relative">
      <Animated.View
        className="absolute inset-0"
        style={{ transform: [{ scale: ringScale }], opacity: ringOpacity }}
      >
        <View className="h-[116px] w-[116px] rounded-xl border border-gold/30" />
      </Animated.View>
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="items-center justify-center"
      >
        <MosqueMark size="xl" />
      </Animated.View>
    </View>
  );
}
