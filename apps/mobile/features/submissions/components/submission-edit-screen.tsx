import { useForm, useStore } from "@tanstack/react-form";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Text } from "@/components/ui/text";
import {
  useDeleteMySubmission,
  useMySubmission,
  useUpdateMySubmission,
} from "../hooks/use-submissions";
import {
  EMPTY_SUBMISSION,
  type MosqueSubmissionInput,
  mosqueSubmissionSchema,
} from "../lib/schemas";
import { SubmissionFormFields } from "./submission-form-fields";

export function SubmissionEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: submission, isLoading } = useMySubmission(id);
  const update = useUpdateMySubmission();
  const del = useDeleteMySubmission();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: EMPTY_SUBMISSION,
    validators: { onChange: mosqueSubmissionSchema },
    onSubmit: async ({ value }) => {
      if (!id) return;
      try {
        await update.mutateAsync({
          id,
          ...(value as MosqueSubmissionInput),
        });
        Alert.alert("Saved", "Your changes are live.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not save changes",
        );
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: form from useForm is stable; re-running on form identity would loop
  useEffect(() => {
    if (!submission) return;
    form.reset({
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
    });
    setErrorMessage(null);
  }, [submission]);

  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const canSubmit = useStore(form.store, (s) => s.canSubmit);

  const readOnly = submission && submission.status !== "pending";

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      "Withdraw submission?",
      "This removes the pending row. You can submit again later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          style: "destructive",
          onPress: async () => {
            try {
              await del.mutateAsync(id);
              router.back();
            } catch (err) {
              Alert.alert(
                "Could not withdraw",
                err instanceof Error ? err.message : "Try again.",
              );
            }
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
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

      {isLoading || !submission ? (
        <View className="flex-1 items-center justify-center">
          <Text variant="body" tone="muted">
            Loading…
          </Text>
        </View>
      ) : (
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
            <View className="mb-s-4 rounded-md border border-line bg-white p-s-4">
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
            <View className="mb-s-4 rounded-md border border-[#b04a3a]/40 bg-[#f8e4df] p-s-3">
              <Text variant="body-sm" className="text-[#b04a3a]">
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <SubmissionFormFields
            form={form}
            isSubmitting={isSubmitting || Boolean(readOnly)}
          />

          {!readOnly ? (
            <View className="mt-s-6 gap-s-3">
              <Button
                label={isSubmitting ? "Saving…" : "Save changes"}
                onPress={() => form.handleSubmit()}
                disabled={!canSubmit || isSubmitting}
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
      )}
    </View>
  );
}
