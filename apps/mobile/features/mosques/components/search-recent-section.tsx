import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  useClearRecentMosques,
  useRecentMosqueIds,
} from "../hooks/use-recent-mosques";
import type { MosqueListItem } from "../lib/types";
import { SearchRecentRow } from "./search-recent-row";

type Props = {
  mosques: readonly MosqueListItem[];
};

export function SearchRecentSection({ mosques }: Props) {
  const recent = useRecentMosqueIds();
  const clear = useClearRecentMosques();

  const items = (recent.data ?? [])
    .map((id) => mosques.find((m) => m.id === id))
    .filter((m): m is MosqueListItem => Boolean(m));

  if (!items.length) return null;

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text variant="eyebrow" tone="muted">
          Recent
        </Text>
        <Pressable
          onPress={() => clear.mutate()}
          hitSlop={8}
          disabled={clear.isPending}
        >
          <Text variant="caption" tone="muted">
            Clear
          </Text>
        </Pressable>
      </View>
      <View className="mt-s-1">
        {items.map((m) => (
          <SearchRecentRow key={m.id} id={m.id} label={m.name} />
        ))}
      </View>
    </View>
  );
}
