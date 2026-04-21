import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { useThemeColors } from "@/lib/theme";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export function RatingStarsInput({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-s-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <Pressable
            key={star}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(star);
            }}
            hitSlop={8}
          >
            <Icon
              name="star"
              size={36}
              color={active ? colors.gold : colors.line}
              fill={active ? colors.gold : "none"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
