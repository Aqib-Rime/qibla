import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  id: string;
  name: string;
  subtitle: string | null;
  area: string | null;
  rating: number | null;
  reviewsCount: number;
};

export function SavedMosqueCard({
  id,
  name,
  subtitle,
  area,
  rating,
  reviewsCount,
}: Props) {
  return (
    <Pressable
      onPress={() => router.push(`/mosque/${id}`)}
      className="flex-1 gap-s-2 rounded-md border border-line bg-white p-s-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View className="h-16 w-16 items-center justify-center rounded-sm bg-green-tint">
        <Icon name="pin" size={22} color="#2e5d45" />
      </View>
      <Text variant="label" numberOfLines={1}>
        {name}
      </Text>
      {subtitle || area ? (
        <Text variant="caption" tone="muted" numberOfLines={1}>
          {subtitle ?? area}
        </Text>
      ) : null}
      {typeof rating === "number" ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="star" size={12} color="#b68a3c" />
          <Text variant="caption">
            {rating.toFixed(1)}
            <Text variant="caption" tone="muted">
              {" "}
              · {reviewsCount}
            </Text>
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
