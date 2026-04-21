import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useUserLocation } from "@/lib/use-user-location";
import { useMosquesList } from "../hooks/use-mosques";
import { applySearch } from "../lib/apply-filters";
import { SearchInputBar } from "./search-input-bar";
import { SearchPlacesRow } from "./search-places-row";
import { SearchPopularSection } from "./search-popular-section";
import { SearchRecentSection } from "./search-recent-section";
import { SearchResultRow } from "./search-result-row";
import { SearchResultsSkeleton } from "./search-results-skeleton";

export function SearchModalScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { data, isLoading } = useMosquesList({ pageSize: 50 });
  const mosques = data?.data ?? [];
  const userPos = useUserLocation();

  const results = useMemo(() => applySearch(mosques, query), [mosques, query]);

  // Debounce the query before hitting Google Places so slider-quick typing
  // doesn't burn quota. 400ms feels responsive without being chatty.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(trimmed), 400);
    return () => clearTimeout(t);
  }, [query]);

  const placesEnabled = debouncedQuery.length >= 2;
  const places = useQuery({
    queryKey: [
      "places",
      "search",
      debouncedQuery,
      userPos?.lat,
      userPos?.lng,
    ] as const,
    queryFn: () =>
      api.places.searchMosques({
        query: debouncedQuery,
        lat: userPos?.lat,
        lng: userPos?.lng,
      }),
    enabled: placesEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const placeResults = places.data?.data ?? [];

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
          <View className="gap-s-6">
            {results.length === 0 && placeResults.length === 0 ? (
              <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
                <Icon name="search" size={28} color="#6b7a70" />
                <Text variant="label" tone="muted">
                  No matches for "{query.trim()}"
                </Text>
              </View>
            ) : null}

            {results.length > 0 ? (
              <View className="gap-s-3">
                {results.map((m) => (
                  <SearchResultRow key={m.id} mosque={m} />
                ))}
              </View>
            ) : null}

            {placesEnabled && placeResults.length > 0 ? (
              <View className="gap-s-3">
                <Text variant="eyebrow" tone="muted">
                  More nearby — via Google
                </Text>
                {placeResults.map((p) => (
                  <SearchPlacesRow key={p.placeId} place={p} />
                ))}
              </View>
            ) : null}
          </View>
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
