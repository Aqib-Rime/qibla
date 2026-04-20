import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import {
  countActive,
  type FilterKey,
  useMosqueFilters,
} from "../lib/filters-store";
import { FilterModalHeader } from "./filter-modal-header";
import { FilterToggleRow } from "./filter-toggle-row";

type FilterDef = {
  key: FilterKey;
  icon: IconName;
  label: string;
  description: string;
};

const FILTERS: FilterDef[] = [
  {
    key: "openOnly",
    icon: "clock",
    label: "Open now",
    description: "Hide mosques currently closed",
  },
  {
    key: "women",
    icon: "users",
    label: "Women-friendly",
    description: "Has a dedicated women's section",
  },
  {
    key: "parking",
    icon: "parking",
    label: "Parking",
    description: "On-site parking available",
  },
  {
    key: "jummah",
    icon: "compass",
    label: "Jummah",
    description: "Hosts Friday prayers",
  },
];

export function FilterModalScreen() {
  const filters = useMosqueFilters();
  const active = countActive(filters);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <FilterModalHeader activeCount={active} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-s-3">
          {FILTERS.map((f) => (
            <FilterToggleRow
              key={f.key}
              icon={f.icon}
              label={f.label}
              description={f.description}
              active={filters[f.key]}
              onToggle={() => filters.toggle(f.key)}
            />
          ))}
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="bg-cream">
        <View className="flex-row gap-s-3 border-line border-t px-s-6 py-s-3">
          <View className="flex-1">
            <Button
              label="Clear"
              variant="outline"
              onPress={() => filters.clear()}
              disabled={active === 0}
            />
          </View>
          <View className="flex-1">
            <Button
              label={active ? `Show (${active})` : "Done"}
              trailing={<Icon name="arrow" size={16} color="#ffffff" />}
              onPress={() => router.back()}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
