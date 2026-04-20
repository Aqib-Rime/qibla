import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  name: string;
  email: string;
  onPress?: () => void;
};

const AVATAR_SHADOW = {
  shadowColor: "#2e5d45",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.3,
  shadowRadius: 18,
  elevation: 6,
};

function initial(name: string) {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function ProfileHeroCard({ name, email, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-s-4 rounded-lg border border-line/80 bg-white p-s-5"
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.85 : 1 })}
    >
      <View
        className="h-16 w-16 items-center justify-center rounded-pill bg-green"
        style={AVATAR_SHADOW}
      >
        <Text tone="white" className="font-sans-semibold text-[26px]">
          {initial(name)}
        </Text>
      </View>
      <View className="min-w-0 flex-1">
        <Text variant="display-sm" numberOfLines={1}>
          {name}
        </Text>
        <Text
          variant="body-sm"
          tone="muted"
          numberOfLines={1}
          className="mt-s-1"
        >
          {email}
        </Text>
      </View>
      {onPress ? <Icon name="chevron" size={18} color="#6b7a70" /> : null}
    </Pressable>
  );
}
