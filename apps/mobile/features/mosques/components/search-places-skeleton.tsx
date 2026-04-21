import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchPlacesSkeleton() {
  return (
    <View className="gap-s-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton, row index is stable
          key={i}
          className="flex-row items-center gap-s-3 rounded-md bg-white p-s-4"
        >
          <Skeleton className="h-10 w-10 rounded-sm" />
          <View className="flex-1 gap-s-2">
            <Skeleton className="h-3 w-2/3 rounded-sm" />
            <Skeleton className="h-2 w-1/2 rounded-sm" />
          </View>
          <Skeleton className="h-2 w-10 rounded-sm" />
        </View>
      ))}
    </View>
  );
}
