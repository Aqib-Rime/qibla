import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function PrayerTimesSkeleton() {
  return (
    <View className="gap-s-3">
      <Skeleton className="h-[100px] w-full rounded-md" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-md" />
      ))}
    </View>
  );
}
