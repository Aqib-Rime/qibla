import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

export type MosqueTab = "overview" | "times" | "events" | "reviews";

const TABS: { key: MosqueTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "times", label: "Times" },
  { key: "events", label: "Events" },
  { key: "reviews", label: "Reviews" },
];

type Props = {
  active: MosqueTab;
  onChange: (tab: MosqueTab) => void;
};

export function MosqueDetailTabs({ active, onChange }: Props) {
  return (
    <View className="border-line border-b px-s-6">
      <View className="flex-row gap-s-5">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <Pressable
              key={t.key}
              onPress={() => onChange(t.key)}
              className="py-s-3"
            >
              <Text
                variant="label"
                tone={isActive ? "ink" : "muted"}
                className={isActive ? "font-sans-semibold" : ""}
              >
                {t.label}
              </Text>
              {isActive ? (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-green" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
