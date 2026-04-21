import { useCallback, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Button, type ButtonVariant } from "./button";
import { Text } from "./text";

export type DialogAction = {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void | Promise<void>;
};

export type DialogConfig = {
  title: string;
  body?: string;
  actions: DialogAction[];
  dismissOnBackdrop?: boolean;
};

type AppDialogProps = DialogConfig & {
  visible: boolean;
  onClose: () => void;
};

/**
 * Branded modal dialog matching the Qibla design system — cream card,
 * muted body text, green/destructive buttons. Drop-in replacement for
 * Alert.alert where we want the UI to feel part of the product.
 */
export function AppDialog({
  visible,
  onClose,
  title,
  body,
  actions,
  dismissOnBackdrop = true,
}: AppDialogProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={dismissOnBackdrop ? onClose : undefined}
        className="flex-1 items-center justify-center bg-black/50 px-s-6"
      >
        <Pressable
          // Stop the tap from bubbling to the backdrop and dismissing the
          // dialog when the user taps the card itself.
          onPress={() => {}}
          className="w-full rounded-md bg-cream p-s-5"
          style={{ maxWidth: 420 }}
        >
          <Text variant="display-sm">{title}</Text>
          {body ? (
            <Text variant="body" tone="muted" className="mt-s-2">
              {body}
            </Text>
          ) : null}
          <View className="mt-s-5 gap-s-2">
            {actions.map((a) => (
              <Button
                key={a.label}
                label={a.label}
                variant={a.variant ?? "primary"}
                onPress={async () => {
                  onClose();
                  await a.onPress?.();
                }}
              />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Imperative-feeling API on top of <AppDialog>:
 *   const dialog = useAppDialog();
 *   dialog.show({ title, body, actions });
 *   {dialog.element}
 */
export function useAppDialog() {
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const show = useCallback((cfg: DialogConfig) => setConfig(cfg), []);
  const hide = useCallback(() => setConfig(null), []);

  const element = config ? (
    <AppDialog visible onClose={hide} {...config} />
  ) : null;

  return { show, hide, element };
}
