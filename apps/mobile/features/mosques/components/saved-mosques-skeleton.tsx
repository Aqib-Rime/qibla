import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function SavedMosquesSkeleton() {
  return (
    <View className="gap-s-3">
      {Array.from({ length: 3 }).map((_, row) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, index is stable
        <View key={row} className="flex-row gap-s-3">
          <Skeleton className="h-36 flex-1 rounded-md" />
          <Skeleton className="h-36 flex-1 rounded-md" />
        </View>
      ))}
    </View>
  );
}
