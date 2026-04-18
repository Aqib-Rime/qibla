import { Skeleton } from "@/components/ui/skeleton"
import { View } from "react-native"

export function SearchResultsSkeleton() {
  return (
    <View className="gap-s-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-md" />
      ))}
    </View>
  )
}
