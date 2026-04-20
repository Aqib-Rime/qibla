import { Pressable, View } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import {
  formatTime12,
  nextPrayer,
  PRAYER_LABEL,
  type Timings,
} from "@/features/prayer-times";

type Props = {
  mosqueCount: number;
  mosquesLoading: boolean;
  mosquesError: boolean;
  timings: Timings | null;
  onRetry: () => void;
  onSearch: () => void;
  onOpenMenu: () => void;
};

const PILL_SHADOW = {
  shadowColor: "#1a2a22",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.14,
  shadowRadius: 18,
  elevation: 6,
};

function PillIconButton({
  icon,
  onPress,
  accessibilityLabel,
}: {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={14}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      <Icon name={icon} size={22} color="#1a2a22" />
    </Pressable>
  );
}

export function MapTopPill({
  mosqueCount,
  mosquesLoading,
  mosquesError,
  timings,
  onRetry,
  onSearch,
  onOpenMenu,
}: Props) {
  const next = timings ? nextPrayer(timings) : null;

  const title = next
    ? `${next.tomorrow ? "Tomorrow · " : ""}${PRAYER_LABEL[next.name]} · ${formatTime12(next.time)}`
    : mosquesLoading
      ? null
      : mosquesError
        ? "Could not load mosques"
        : `${mosqueCount} mosques nearby`;

  return (
    <View
      className="flex-row items-center gap-s-4 rounded-md border border-line/80 bg-white px-s-5 py-s-3"
      style={PILL_SHADOW}
    >
      <PillIconButton
        icon="search"
        onPress={onSearch}
        accessibilityLabel="Search mosques"
      />
      <View className="flex-1">
        {title ? (
          <Text variant="label" tone="ink" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Skeleton className="h-4 w-32 rounded-sm" />
        )}
        <Text variant="caption" tone="muted" numberOfLines={1}>
          Tap a pin for details
        </Text>
      </View>
      {mosquesError ? (
        <Pressable onPress={onRetry} hitSlop={10}>
          <Text variant="label" tone="green">
            Retry
          </Text>
        </Pressable>
      ) : (
        <PillIconButton
          icon="more"
          onPress={onOpenMenu}
          accessibilityLabel="Open menu"
        />
      )}
    </View>
  );
}
