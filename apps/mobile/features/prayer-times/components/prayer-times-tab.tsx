import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useThemeColors } from "@/lib/theme";
import { usePrayerTimes } from "../hooks/use-prayer-times";
import { nextPrayer, PRAYER_ORDER } from "../lib/prayer";
import { PrayerTimesNextCard } from "./prayer-times-next-card";
import { PrayerTimesRow } from "./prayer-times-row";
import { PrayerTimesSkeleton } from "./prayer-times-skeleton";

type Props = {
  lat: number;
  lng: number;
};

export function PrayerTimesTab({ lat, lng }: Props) {
  const { data, isLoading, error, refetch } = usePrayerTimes({ lat, lng });
  const colors = useThemeColors();

  if (isLoading) return <PrayerTimesSkeleton />;

  if (error || !data) {
    return (
      <View className="items-center gap-s-3 rounded-md bg-surface px-s-5 py-s-8">
        <Icon name="alert" size={28} color={colors.muted} />
        <Text variant="label" tone="muted">
          Could not load prayer times
        </Text>
        <Pressable onPress={() => refetch()}>
          <Text variant="label" tone="green">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  const next = nextPrayer(data.timings);

  return (
    <View className="gap-s-3">
      <PrayerTimesNextCard
        name={next.name}
        time={next.time}
        tomorrow={next.tomorrow}
      />
      {PRAYER_ORDER.map((name) => (
        <PrayerTimesRow
          key={name}
          name={name}
          time={data.timings[name]}
          active={name === next.name && !next.tomorrow}
        />
      ))}
    </View>
  );
}
