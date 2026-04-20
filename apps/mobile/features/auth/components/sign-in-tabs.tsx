import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

type Tab = "in" | "up";

const ACTIVE_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 2,
  elevation: 1,
};

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function SignInTabs({ active, onChange }: Props) {
  return (
    <View className="flex-row rounded-pill bg-[#ece3c9] p-1">
      {(["in", "up"] as const).map((key) => {
        const isActive = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={`flex-1 rounded-pill py-s-2 ${isActive ? "bg-white" : ""}`}
            style={isActive ? ACTIVE_SHADOW : undefined}
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
