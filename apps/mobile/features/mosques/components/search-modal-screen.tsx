import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useUserLocation } from "@/lib/use-user-location";
import { useMosquesList } from "../hooks/use-mosques";
import { applySearch } from "../lib/apply-filters";
import { SearchInputBar } from "./search-input-bar";
import { SearchPopularSection } from "./search-popular-section";
import { SearchRecentSection } from "./search-recent-section";
import { SearchResultRow } from "./search-result-row";
import { SearchResultsSkeleton } from "./search-results-skeleton";

export function SearchModalScreen() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useMosquesList({ pageSize: 50 });
  const mosques = data?.data ?? [];
  const userPos = useUserLocation();

  const results = useMemo(() => applySearch(mosques, query), [mosques, query]);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <SearchInputBar value={query} onChange={setQuery} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <SearchResultsSkeleton />
        ) : query ? (
          results.length === 0 ? (
            <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
              <Icon name="search" size={28} color="#6b7a70" />
              <Text variant="label" tone="muted">
                No matches for "{query.trim()}"
              </Text>
            </View>
          ) : (
            <View className="gap-s-3">
              {results.map((m) => (
                <SearchResultRow key={m.id} mosque={m} />
              ))}
            </View>
          )
        ) : (
          <View className="gap-s-7">
            <SearchRecentSection mosques={mosques} />
            <SearchPopularSection mosques={mosques} userPos={userPos} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
