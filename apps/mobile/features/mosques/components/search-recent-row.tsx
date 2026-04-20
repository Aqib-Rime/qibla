import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  id: string;
  label: string;
};

export function SearchRecentRow({ id, label }: Props) {
  return (
    <Pressable
      onPress={() => router.replace(`/mosque/${id}`)}
      className="flex-row items-center gap-s-4 py-s-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <View className="h-10 w-10 items-center justify-center rounded-pill">
        <Icon name="clock" size={22} color="#6b7a70" />
      </View>
      <Text variant="body" className="flex-1" numberOfLines={1}>
        {label}
      </Text>
      <Icon name="arrow" size={18} color="#6b7a70" />
    </Pressable>
  );
}
