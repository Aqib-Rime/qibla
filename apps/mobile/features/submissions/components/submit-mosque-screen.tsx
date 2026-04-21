import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useAppDialog } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import { useAppToast } from "@/components/ui/toast";
import { useThemeScheme } from "@/features/theme/hooks/use-theme-scheme";
import { useSubmitMosque } from "../hooks/use-submissions";
import { collectInvalidLabels } from "../lib/collect-invalid-labels";
import {
  EMPTY_SUBMISSION,
  type MosqueSubmissionInput,
  mosqueSubmissionSchema,
} from "../lib/schemas";
import { SubmissionFormFields } from "./submission-form-fields";

export function SubmitMosqueScreen() {
  const submit = useSubmitMosque();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dialog = useAppDialog();
  const toast = useAppToast();
  const scheme = useThemeScheme();

  const form = useForm({
    defaultValues: EMPTY_SUBMISSION,
    // Don't run validation until the user taps Submit; once they have,
    // validate on every change so errors clear as they fix each field.
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    validators: { onDynamic: mosqueSubmissionSchema },
    onSubmitInvalid: ({ formApi }) => {
      const missing = collectInvalidLabels(formApi.state.fieldMeta);
      toast.show({
        title: "Missing info",
        body:
          missing.length > 0
            ? `Please fix: ${missing.join(", ")}`
            : "Please fix the highlighted fields.",
        tone: "warning",
      });
    },
    onSubmit: async ({ value }) => {
      try {
        await submit.mutateAsync(value as MosqueSubmissionInput);
        dialog.show({
          title: "Submitted for review",
          body: "Thanks for the contribution! An admin will review and approve it soon.",
          actions: [
            {
              label: "Done",
              onPress: () => router.replace("/submissions"),
            },
          ],
        });
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not submit mosque",
        );
      }
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <SafeAreaView edges={["top"]} className="bg-cream">
        <View className="flex-row items-center justify-between px-s-5 py-s-2">
          <IconButton
            icon="back"
            size="sm"
            variant="ghost"
            onPress={() => router.back()}
            accessibilityLabel="Back"
          />
          <Text variant="display-sm">Submit a mosque</Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="body" tone="muted" className="mb-s-4">
          Fill in what you know — the admin team reviews every submission before
          it goes live on the map. You can edit anything until it&apos;s
          approved.
        </Text>

        {errorMessage ? (
          <View className="mb-s-4 rounded-md border border-danger/40 bg-danger-tint p-s-3">
            <Text variant="body-sm" className="text-danger">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <SubmissionFormFields form={form} isSubmitting={isSubmitting} />

        <View className="mt-s-6">
          <Button
            label={isSubmitting ? "Submitting…" : "Submit for review"}
            onPress={() => form.handleSubmit()}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>

      {dialog.element}
      {toast.element}
    </View>
  );
}
