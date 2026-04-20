import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useMosque } from "@/features/mosques/hooks/use-mosques";
import { useCreateReview } from "../hooks/use-reviews";
import { RatingStarsInput } from "./rating-stars-input";
import { ReviewFormHeader } from "./review-form-header";

export function ReviewFormScreen() {
  const { mosqueId } = useLocalSearchParams<{ mosqueId: string }>();
  const { data } = useMosque(mosqueId);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const create = useCreateReview();

  const submit = async () => {
    if (!mosqueId) return;
    if (rating < 1) {
      setError("Pick a rating between 1 and 5.");
      return;
    }
    setError(null);
    try {
      await create.mutateAsync({
        mosqueId,
        rating,
        body: body.trim() || undefined,
      });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit review");
    }
  };

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style="dark" />
      <ReviewFormHeader mosqueName={data?.mosque.name} />
      <KeyboardAwareScrollView
        bottomOffset={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="display-md">How was your visit?</Text>
        <Text variant="body" tone="muted" className="mt-s-2">
          Reviews help others find the right mosque. A moderator will review
          your note before it goes public.
        </Text>

        <View className="mt-s-6 items-center">
          <RatingStarsInput value={rating} onChange={setRating} />
          <Text variant="caption" tone="muted" className="mt-s-3">
            {rating === 0 ? "Tap a star to rate" : `${rating} out of 5`}
          </Text>
        </View>

        <View className="mt-s-6 rounded-md border border-line bg-white p-s-4">
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Share what stood out — facilities, imam, cleanliness…"
            placeholderTextColor="#6b7a70"
            multiline
            numberOfLines={6}
            maxLength={1000}
            style={{
              minHeight: 120,
              textAlignVertical: "top",
              fontFamily: "Geist_400Regular",
              fontSize: 15,
              color: "#1a2a22",
            }}
          />
          <Text variant="caption" tone="muted" className="mt-s-2 text-right">
            {body.length}/1000
          </Text>
        </View>

        {error ? (
          <Text variant="body-sm" className="mt-s-3 text-[#b42318]">
            {error}
          </Text>
        ) : null}

        <View className="flex-1" />
        <View className="mt-s-6">
          <Button
            label="Submit review"
            loading={create.isPending}
            onPress={submit}
            trailing={<Icon name="arrow" size={16} color="#fff" />}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
