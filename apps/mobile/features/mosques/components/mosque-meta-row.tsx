import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  rating: number | null;
  reviewsCount: number;
  open: boolean;
  area: string | null;
  distanceKm?: number;
};

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
}

export function MosqueMetaRow({
  rating,
  reviewsCount,
  open,
  area,
  distanceKm,
}: Props) {
  return (
    <View className="flex-row items-center gap-s-4">
      {typeof rating === "number" ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="star" size={14} color="#b68a3c" />
          <Text variant="label">
            {rating.toFixed(1)}
            <Text variant="label" tone="muted">
              {" "}
              ({reviewsCount})
            </Text>
          </Text>
        </View>
      ) : null}
      <View className="flex-row items-center gap-s-1">
        <Icon name="clock" size={14} color={open ? "#2e5d45" : "#6b7a70"} />
        <Text variant="label" tone={open ? "green" : "muted"}>
          {open ? "Open" : "Closed"}
        </Text>
      </View>
      {typeof distanceKm === "number" ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="pin" size={14} color="#2e5d45" />
          <Text variant="label" tone="green">
            {formatDistance(distanceKm)}
          </Text>
        </View>
      ) : area ? (
        <View className="flex-row items-center gap-s-1">
          <Icon name="pin" size={14} color="#6b7a70" />
          <Text variant="label" tone="muted">
            {area}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
