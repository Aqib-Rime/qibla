import { View } from "react-native";
import { Text } from "@/components/ui/text";

const ROWS = [
  { name: "Fajr", time: "4:42", state: "past" },
  { name: "Dhuhr", time: "12:10", state: "past" },
  { name: "Asr", time: "3:42", state: "next" },
  { name: "Maghrib", time: "5:58", state: "" },
  { name: "Isha", time: "7:20", state: "" },
] as const;

export function ArtTimes() {
  return (
    <View className="flex-1 bg-[#f5efd9] p-s-4">
      <View className="gap-s-2 mt-s-3">
        {ROWS.map((r) => {
          const isNext = r.state === "next";
          const isPast = r.state === "past";
          return (
            <View
              key={r.name}
              className={`flex-row items-center justify-between rounded-md px-s-4 py-s-3 ${
                isNext ? "bg-green" : "bg-white border border-line"
              }`}
            >
              <Text
                variant="title"
                tone={isNext ? "white" : isPast ? "muted" : "ink"}
              >
                {r.name}
              </Text>
              <Text
                variant="display-sm"
                tone={isNext ? "white" : isPast ? "muted" : "ink"}
                className="font-mono"
              >
                {r.time}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
