import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";

export function MosqueDetailSkeleton() {
  return (
    <View className="flex-1 px-s-6 pt-s-2">
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <Skeleton className="mt-s-3 h-4 w-1/2 rounded-sm" />
      <View className="mt-s-4 flex-row gap-s-4">
        <Skeleton className="h-4 w-16 rounded-sm" />
        <Skeleton className="h-4 w-16 rounded-sm" />
        <Skeleton className="h-4 w-20 rounded-sm" />
      </View>

      <View className="mt-s-5 flex-row gap-s-5 border-line border-b pb-s-3">
        <Skeleton className="h-4 w-16 rounded-sm" />
        <Skeleton className="h-4 w-12 rounded-sm" />
        <Skeleton className="h-4 w-14 rounded-sm" />
        <Skeleton className="h-4 w-16 rounded-sm" />
      </View>

      <View className="mt-s-5 gap-s-3">
        <Skeleton className="h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-5/6 rounded-sm" />
        <Skeleton className="h-4 w-4/5 rounded-sm" />
      </View>

      <Skeleton className="mt-s-5 h-16 w-full rounded-md" />
      <Skeleton className="mt-s-4 h-16 w-full rounded-md" />
    </View>
  );
}
