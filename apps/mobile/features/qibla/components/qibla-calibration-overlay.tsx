import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

export function QiblaCalibrationOverlay() {
  const progress = useRef(new Animated.Value(0)).current;
  const colors = useThemeColors();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-40, 40, -40, 40, -40],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -20, 0, 20, 0],
  });

  return (
    <View className="absolute inset-0 items-center justify-center bg-cream/85 px-s-6">
      <View className="items-center">
        <Animated.View
          style={{ transform: [{ translateX }, { translateY }] }}
          className="h-16 w-16 items-center justify-center rounded-pill bg-green"
        >
          <Icon name="compass" size={28} color={colors.white} />
        </Animated.View>
        <Text variant="display-sm" className="mt-s-5 text-center">
          Calibrate your compass
        </Text>
        <Text
          variant="body"
          tone="muted"
          className="mt-s-2 max-w-[280px] text-center"
        >
          Move your phone in a figure-8 motion to improve the accuracy.
        </Text>
      </View>
    </View>
  );
}
