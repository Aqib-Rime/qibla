import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

type MenuItem = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

export function MapTopMenu({ onClose }: { onClose: () => void }) {
  const colors = useThemeColors();
  const menuShadow = {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  };
  const items: MenuItem[] = [
    {
      label: "Find Qibla",
      icon: "compass",
      onPress: () => {
        onClose();
        router.push("/qibla");
      },
    },
    {
      label: "Saved mosques",
      icon: "heart",
      onPress: () => {
        onClose();
        router.push("/(tabs)/saved");
      },
    },
    {
      label: "Profile",
      icon: "user",
      onPress: () => {
        onClose();
        router.push("/(tabs)/profile");
      },
    },
  ];

  return (
    <View
      className="absolute right-0 top-full mt-s-2 min-w-[240px] overflow-hidden rounded-lg border border-line/80 bg-surface"
      style={menuShadow}
    >
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <Pressable
            key={it.label}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              it.onPress();
            }}
            className={`flex-row items-center gap-s-3 px-s-4 py-s-3 ${
              isLast ? "" : "border-b border-line"
            }`}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="h-8 w-8 items-center justify-center rounded-sm bg-green-tint">
              <Icon name={it.icon} size={15} color={colors.green} />
            </View>
            <Text variant="body" className="flex-1">
              {it.label}
            </Text>
            <Icon name="chevron" size={14} color={colors.muted} />
          </Pressable>
        );
      })}
    </View>
  );
}
