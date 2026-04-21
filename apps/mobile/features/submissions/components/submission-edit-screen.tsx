import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { router, useLocalSearchParams } from "expo-router";
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
import {
  useDeleteMySubmission,
  useMySubmission,
  useUpdateMySubmission,
} from "../hooks/use-submissions";
import { collectInvalidLabels } from "../lib/collect-invalid-labels";
import {
  type MosqueSubmissionInput,
  mosqueSubmissionSchema,
} from "../lib/schemas";
import { SubmissionFormFields } from "./submission-form-fields";

type Submission = NonNullable<ReturnType<typeof useMySubmission>["data"]>;

export function SubmissionEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: submission, isLoading } = useMySubmission(id);
  const scheme = useThemeScheme();

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
          <Text variant="display-sm">Edit submission</Text>
          <View className="h-10 w-10" />
        </View>
      </SafeAreaView>

      {isLoading || !submission || !id ? (
        <View className="flex-1 items-center justify-center">
          <Text variant="body" tone="muted">
            Loading…
          </Text>
        </View>
      ) : (
        <EditSubmissionForm id={id} submission={submission} />
      )}
    </View>
  );
}

function submissionToDefaults(submission: Submission): MosqueSubmissionInput {
  return {
    name: submission.name,
    subtitle: submission.subtitle ?? null,
    about: submission.about ?? null,
    address: submission.address ?? null,
    street: submission.street ?? null,
    area: submission.area ?? null,
    city: submission.city,
    lat: submission.lat,
    lng: submission.lng,
    open: submission.open,
    tags: submission.tags ?? [],
    facilities: submission.facilities ?? [],
    photos: submission.photos ?? [],
  };
}

function EditSubmissionForm({
  id,
  submission,
}: {
  id: string;
  submission: Submission;
}) {
  const update = useUpdateMySubmission();
  const del = useDeleteMySubmission();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dialog = useAppDialog();
  const toast = useAppToast();
  const readOnly = submission.status !== "pending";

  const form = useForm({
    defaultValues: submissionToDefaults(submission),
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
        await update.mutateAsync({
          id,
          ...(value as MosqueSubmissionInput),
        });
        dialog.show({
          title: "Saved",
          body: "Your changes are live.",
          actions: [{ label: "Done", onPress: () => router.back() }],
        });
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not save changes",
        );
      }
    },
  });

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  const handleDelete = () => {
    dialog.show({
      title: "Withdraw submission?",
      body: "This removes the pending row. You can submit again later.",
      actions: [
        { label: "Cancel", variant: "outline" },
        {
          label: "Withdraw",
          variant: "destructive",
          onPress: async () => {
            try {
              await del.mutateAsync(id);
              router.back();
            } catch (err) {
              dialog.show({
                title: "Could not withdraw",
                body: err instanceof Error ? err.message : "Try again.",
                actions: [{ label: "OK" }],
              });
            }
          },
        },
      ],
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {readOnly ? (
          <View className="mb-s-4 rounded-md border border-line bg-surface p-s-4">
            <Text variant="label">
              This mosque is already {submission.status}
            </Text>
            <Text variant="caption" tone="muted" className="mt-s-1">
              Approved and hidden mosques can only be changed by an admin. You
              can still view the details below.
            </Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View className="mb-s-4 rounded-md border border-danger/40 bg-danger-tint p-s-3">
            <Text variant="body-sm" className="text-danger">
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <SubmissionFormFields
          form={form}
          isSubmitting={isSubmitting || readOnly}
        />

        {!readOnly ? (
          <View className="mt-s-6 gap-s-3">
            <Button
              label={isSubmitting ? "Saving…" : "Save changes"}
              onPress={() => form.handleSubmit()}
              disabled={isSubmitting}
            />
            <Button
              label="Withdraw submission"
              variant="outline"
              onPress={handleDelete}
              disabled={del.isPending}
            />
          </View>
        ) : null}
      </ScrollView>

      {dialog.element}
      {toast.element}
    </>
  );
}
