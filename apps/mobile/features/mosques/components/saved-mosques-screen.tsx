import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useSavedMosques } from "../hooks/use-mosques";
import { SavedMosqueCard } from "./saved-mosque-card";
import { SavedMosquesEmpty } from "./saved-mosques-empty";
import { SavedMosquesHeader } from "./saved-mosques-header";
import { SavedMosquesSkeleton } from "./saved-mosques-skeleton";

function chunkPairs<T>(items: readonly T[]): [T, T | null][] {
  const pairs: [T, T | null][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i] as T, items[i + 1] ?? null]);
  }
  return pairs;
}

export function SavedMosquesScreen() {
  const { data, isLoading } = useSavedMosques();
  const rows = data?.data ?? [];
  const pairs = chunkPairs(rows);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SavedMosquesHeader />
      <View className="px-s-6 pt-s-2">
        <Text variant="body" tone="muted">
          {rows.length
            ? `${rows.length} mosque${rows.length === 1 ? "" : "s"} saved`
            : "Your bookmarks live here"}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 px-s-6 pt-s-5">
          <SavedMosquesSkeleton />
        </View>
      ) : rows.length === 0 ? (
        <SavedMosquesEmpty />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-s-3">
            {pairs.map(([left, right]) => (
              <View key={left.id} className="flex-row gap-s-3">
                <SavedMosqueCard
                  id={left.id}
                  name={left.name}
                  subtitle={left.subtitle}
                  area={left.area}
                  rating={left.rating}
                  reviewsCount={left.reviewsCount}
                />
                {right ? (
                  <SavedMosqueCard
                    id={right.id}
                    name={right.name}
                    subtitle={right.subtitle}
                    area={right.area}
                    rating={right.rating}
                    reviewsCount={right.reviewsCount}
                  />
                ) : (
                  <View className="flex-1" />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
