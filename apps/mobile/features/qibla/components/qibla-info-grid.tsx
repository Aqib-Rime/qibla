import { View } from "react-native";
import { Text } from "@/components/ui/text";
import type { HeadingAccuracy } from "../hooks/use-device-heading";

type Props = {
  bearing: number;
  distanceKm: number;
  accuracy: HeadingAccuracy;
};

const ACCURACY_LABEL: Record<HeadingAccuracy, string> = {
  low: "Low — calibrate",
  medium: "Medium",
  high: "High",
};

const ACCURACY_DOTS: Record<HeadingAccuracy, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function formatDistance(km: number): string {
  if (km >= 100) return `${Math.round(km).toLocaleString()} km`;
  return `${km.toFixed(1)} km`;
}

export function QiblaInfoGrid({ bearing, distanceKm, accuracy }: Props) {
  const dots = ACCURACY_DOTS[accuracy];

  return (
    <View className="flex-row gap-s-3">
      <InfoCell label="Qibla" value={`${Math.round(bearing)}°`} />
      <InfoCell label="Mecca" value={formatDistance(distanceKm)} />
      <View className="flex-1 rounded-md border border-line/80 bg-surface p-s-4">
        <Text variant="caption" tone="muted">
          Accuracy
        </Text>
        <View className="mt-s-2 flex-row items-center gap-s-1">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`h-2 w-2 rounded-pill ${
                i < dots ? "bg-green" : "bg-line"
              }`}
            />
          ))}
        </View>
        <Text
          variant="caption"
          tone="muted"
          className="mt-s-1"
          numberOfLines={1}
        >
          {ACCURACY_LABEL[accuracy]}
        </Text>
      </View>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-md border border-line/80 bg-surface p-s-4">
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="display-sm" className="mt-s-2 font-mono">
        {value}
      </Text>
    </View>
  );
}
