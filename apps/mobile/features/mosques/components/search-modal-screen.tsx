import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useUserLocation } from "@/lib/use-user-location";
import { useMosquesList } from "../hooks/use-mosques";
import { SearchInputBar } from "./search-input-bar";
import { SearchPlacesRow } from "./search-places-row";
import { SearchPlacesSkeleton } from "./search-places-skeleton";
import { SearchPopularSection } from "./search-popular-section";
import { SearchRecentPlacesSection } from "./search-recent-places-section";
import { SearchRecentSection } from "./search-recent-section";

export function SearchModalScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { data } = useMosquesList({ pageSize: 50 });
  const mosques = data?.data ?? [];
  const userPos = useUserLocation();

  // Debounce before hitting Google Places so slider-quick typing
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
      api.places.search({
        query: debouncedQuery,
        lat: userPos?.lat,
        lng: userPos?.lng,
      }),
    enabled: placesEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const placeResults = places.data?.data ?? [];
  const searching = placesEnabled;
  // Show the skeleton whenever the query is stale (user is typing a new term)
  // or the very first fetch is in flight — covers both cold loads and refetches.
  const showSkeleton =
    placesEnabled && (places.isFetching || query.trim() !== debouncedQuery);

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
        {searching ? (
          <View className="gap-s-6">
            <Text variant="eyebrow" tone="muted">
              Places
            </Text>

            {showSkeleton ? (
              <SearchPlacesSkeleton />
            ) : placeResults.length === 0 ? (
              <View className="items-center gap-s-2 rounded-md bg-white px-s-5 py-s-8">
                <Icon name="search" size={28} color="#6b7a70" />
                <Text variant="label" tone="muted">
                  No places found for "{query.trim()}"
                </Text>
                <Text variant="caption" tone="muted" className="text-center">
                  Try a neighbourhood, landmark, or address.
                </Text>
              </View>
            ) : (
              <View className="gap-s-3">
                {placeResults.map((p) => (
                  <SearchPlacesRow key={p.placeId} place={p} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View className="gap-s-7">
            <SearchRecentPlacesSection />
            <SearchRecentSection mosques={mosques} />
            <SearchPopularSection mosques={mosques} userPos={userPos} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
