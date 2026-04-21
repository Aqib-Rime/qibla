import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";

type Tab = "in" | "up";

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function SignInTabs({ active, onChange }: Props) {
  const colors = useThemeColors();
  const activeShadow = {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  };
  return (
    <View className="flex-row rounded-pill bg-line p-1">
      {(["in", "up"] as const).map((key) => {
        const isActive = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={`flex-1 rounded-pill py-s-2 ${isActive ? "bg-surface" : ""}`}
            style={isActive ? activeShadow : undefined}
          >
            <Text
              variant="label"
              tone={isActive ? "ink" : "muted"}
              className="text-center"
            >
              {key === "in" ? "Sign in" : "Sign up"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
