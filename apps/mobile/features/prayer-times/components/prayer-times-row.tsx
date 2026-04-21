import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { formatTime12, PRAYER_LABEL, type PrayerName } from "../lib/prayer";

type Props = {
  name: PrayerName;
  time: string;
  active: boolean;
};

export function PrayerTimesRow({ name, time, active }: Props) {
  return (
    <View
      className={`flex-row items-center justify-between rounded-md px-s-4 py-s-4 ${
        active ? "bg-green-tint" : "bg-surface"
      }`}
    >
      <Text variant="label" tone={active ? "green" : "ink"}>
        {PRAYER_LABEL[name]}
      </Text>
      <Text variant="label" tone={active ? "green" : "muted"}>
        {formatTime12(time)}
      </Text>
    </View>
  );
}
