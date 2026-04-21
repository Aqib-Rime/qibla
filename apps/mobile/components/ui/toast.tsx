import { useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./text";

export type ToastTone = "error" | "warning" | "success" | "info";

export type ToastConfig = {
  title: string;
  body?: string;
  tone?: ToastTone;
  /** ms before the toast auto-dismisses. Default 4000. */
  duration?: number;
};

// Warning uses the brand gold token — reads as "heads up, needs attention"
// without the aggressive feel of the error red.
const TONE_BG: Record<ToastTone, string> = {
  error: "bg-danger",
  warning: "bg-gold",
  success: "bg-green",
  info: "bg-ink",
};

type CardProps = {
  config: ToastConfig;
  onDismiss: () => void;
};

function ToastCard({ config, onDismiss }: CardProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, config.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [config, onDismiss]);

  const bgClass = TONE_BG[config.tone ?? "info"];

  return (
    <SafeAreaView
      edges={["top"]}
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 z-50"
    >
      <Animated.View entering={FadeInDown} exiting={FadeOutUp}>
        <Pressable
          onPress={onDismiss}
          className={`mx-s-4 mt-s-2 rounded-md px-s-4 py-s-3 ${bgClass}`}
          style={{
            shadowColor: "#1a2a22",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 6,
          }}
          accessibilityLiveRegion="polite"
        >
          <Text variant="label" tone="white">
            {config.title}
          </Text>
          {config.body ? (
            <Text variant="caption" tone="white-muted" className="mt-s-1">
              {config.body}
            </Text>
          ) : null}
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

/**
 * Imperative-feeling toast API on top of <ToastCard>:
 *   const toast = useAppToast();
 *   toast.show({ title: "Missing info", body: "…", tone: "error" });
 *   {toast.element}
 */
export function useAppToast() {
  const [config, setConfig] = useState<ToastConfig | null>(null);

  const show = useCallback((c: ToastConfig) => setConfig(c), []);
  const hide = useCallback(() => setConfig(null), []);

  const element = config ? (
    <ToastCard config={config} onDismiss={hide} />
  ) : null;

  return { show, hide, element };
}
