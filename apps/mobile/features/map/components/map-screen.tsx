import type BottomSheet from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Icon } from "@/components/ui/icon";
import {
  applyFilters,
  countActive,
  type MosqueListItem,
  useMosqueFilters,
  useMosquesList,
  useMosquesNearby,
} from "@/features/mosques";
import { usePrayerTimes } from "@/features/prayer-times";
import { useUserLocation } from "@/lib/use-user-location";
import { DHAKA_REGION } from "../lib/region";
import { MapMarkers } from "./map-markers";
import { MapMosqueSheet } from "./map-mosque-sheet";
import { MapTopOverlay } from "./map-top-overlay";

type PickedPlace = { lat: number; lng: number; name?: string };

function parsePickedPlace(
  params: Record<string, string | string[] | undefined>,
): PickedPlace | null {
  const lat = Array.isArray(params.lat) ? params.lat[0] : params.lat;
  const lng = Array.isArray(params.lng) ? params.lng[0] : params.lng;
  const name = Array.isArray(params.placeName)
    ? params.placeName[0]
    : params.placeName;
  if (!lat || !lng) return null;
  const latNum = Number(lat);
  const lngNum = Number(lng);
  if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;
  return { lat: latNum, lng: lngNum, name };
}

export function MapScreen() {
  const filters = useMosqueFilters();
  const activeFilters = countActive(filters);
  const userPos = useUserLocation();

  const searchParams = useLocalSearchParams();
  const pickedPlace = useMemo(
    () => parsePickedPlace(searchParams),
    [searchParams],
  );

  // The centre point used for nearby-mosque fetches. Picked place overrides
  // the user's real location so "explore Gulshan" shows mosques near Gulshan,
  // not near the user's actual GPS position.
  const center = pickedPlace ?? userPos;

  // Use the server-side distance filter when we have both a centre and a radius.
  // Otherwise fall back to the full list (we still apply toggles client-side).
  const nearbyParams =
    center && filters.radiusKm != null
      ? { lat: center.lat, lng: center.lng, radiusKm: filters.radiusKm }
      : null;

  const list = useMosquesList({ pageSize: 50 });
  const nearby = useMosquesNearby(nearbyParams);

  // nearby omits some of list's fields that the map/sheet don't use;
  // one cast here keeps both shapes feeding the same consumers.
  const source = nearbyParams ? nearby : list;
  const rows: MosqueListItem[] = (source.data?.data ?? []) as MosqueListItem[];
  const { isLoading, error, refetch } = source;

  const mosques = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  const [selected, setSelected] = useState<MosqueListItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const coords = center ?? {
    lat: DHAKA_REGION.latitude,
    lng: DHAKA_REGION.longitude,
  };
  const { data: prayer } = usePrayerTimes(coords);

  // Animate to the picked place when it changes.
  useEffect(() => {
    if (!pickedPlace) return;
    mapRef.current?.animateToRegion(
      {
        latitude: pickedPlace.lat,
        longitude: pickedPlace.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      600,
    );
  }, [pickedPlace]);

  const handleMarkerPress = useCallback((m: MosqueListItem) => {
    setSelected(m);
    sheetRef.current?.snapToIndex(0);
    mapRef.current?.animateToRegion(
      {
        latitude: m.lat,
        longitude: m.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      400,
    );
  }, []);

  const handleCloseSheet = useCallback(() => {
    sheetRef.current?.close();
    setMenuOpen(false);
  }, []);

  const handleRecenter = useCallback(() => {
    const target = userPos ?? {
      lat: DHAKA_REGION.latitude,
      lng: DHAKA_REGION.longitude,
    };
    // Pressing recenter drops any picked-place override and returns to the
    // user's real location.
    if (pickedPlace) {
      router.setParams({
        lat: undefined,
        lng: undefined,
        placeName: undefined,
      });
    }
    mapRef.current?.animateToRegion(
      {
        latitude: target.lat,
        longitude: target.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      },
      500,
    );
  }, [userPos, pickedPlace]);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DHAKA_REGION}
        showsUserLocation
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={handleCloseSheet}
        onPoiClick={handleCloseSheet}
      >
        <MapMarkers mosques={mosques} onSelect={handleMarkerPress} />
        {pickedPlace ? (
          <Marker
            coordinate={{
              latitude: pickedPlace.lat,
              longitude: pickedPlace.lng,
            }}
            title={pickedPlace.name ?? "Picked location"}
            pinColor="#2e5d45"
          >
            <View className="h-7 w-7 items-center justify-center rounded-pill border-2 border-white bg-green shadow-sm">
              <Icon name="pin" size={14} color="#ffffff" />
            </View>
          </Marker>
        ) : null}
      </MapView>

      {menuOpen ? (
        <Pressable
          onPress={() => setMenuOpen(false)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      <MapTopOverlay
        mosqueCount={mosques.length}
        mosquesLoading={isLoading}
        mosquesError={Boolean(error)}
        timings={prayer?.timings ?? null}
        onRetry={() => refetch()}
        onRecenter={handleRecenter}
        canRecenter={Boolean(userPos) || Boolean(pickedPlace)}
        activeFilters={activeFilters}
        menuOpen={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        onCloseMenu={() => setMenuOpen(false)}
      />

      <MapMosqueSheet
        ref={sheetRef}
        mosque={selected}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}
