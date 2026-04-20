import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultsSkeleton() {
  return (
    <View className="gap-s-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, index is stable
        <Skeleton key={i} className="h-16 w-full rounded-md" />
      ))}
    </View>
  );
}
