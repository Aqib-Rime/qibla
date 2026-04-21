import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type Props = {
  radiusKm: number | null;
  onChange: (radiusKm: number | null) => void;
};

const MIN_KM = 0.5;
const MAX_KM = 10;
const DEFAULT_KM = 3;

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return km >= 10 ? `${km.toFixed(0)} km` : `${km.toFixed(1)} km`;
}

export function FilterDistanceRow({ radiusKm, onChange }: Props) {
  const active = radiusKm != null;

  // Local state while the thumb is dragged — gives smooth visual feedback
  // without spamming the store (which would refetch the map on every tick).
  const [liveValue, setLiveValue] = useState(radiusKm ?? DEFAULT_KM);

  useEffect(() => {
    if (radiusKm != null) setLiveValue(radiusKm);
  }, [radiusKm]);

  const handleToggle = () => {
    Haptics.selectionAsync().catch(() => {});
    onChange(active ? null : DEFAULT_KM);
  };

  return (
    <View
      className={`gap-s-3 rounded-md border bg-white px-s-4 py-s-4 ${
        active ? "border-green" : "border-line"
      }`}
    >
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center gap-s-4"
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <View
          className={`h-10 w-10 items-center justify-center rounded-sm ${
            active ? "bg-green" : "bg-green-tint"
          }`}
        >
          <Icon
            name="recenter"
            size={18}
            color={active ? "#ffffff" : "#2e5d45"}
          />
        </View>
        <View className="flex-1">
          <Text variant="label">Within distance</Text>
          <Text variant="caption" tone="muted" className="mt-s-1">
            {active
              ? `Showing mosques within ${formatKm(liveValue)}`
              : "Limit results to a radius from your location"}
          </Text>
        </View>
        <View
          className={`h-6 w-6 items-center justify-center rounded-sm border ${
            active ? "border-green bg-green" : "border-line bg-white"
          }`}
        >
          {active ? <Icon name="arrow" size={14} color="#ffffff" /> : null}
        </View>
      </Pressable>

      {active ? (
        <View className="gap-s-2">
          <Slider
            minimumValue={MIN_KM}
            maximumValue={MAX_KM}
            step={0.5}
            value={liveValue}
            onValueChange={setLiveValue}
            onSlidingComplete={(v) => onChange(v)}
            minimumTrackTintColor="#2e5d45"
            maximumTrackTintColor="#dcd6bf"
            thumbTintColor="#2e5d45"
          />
          <View className="flex-row justify-between">
            <Text variant="caption" tone="muted">
              {formatKm(MIN_KM)}
            </Text>
            <Text variant="caption" tone="muted">
              {formatKm(MAX_KM)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
