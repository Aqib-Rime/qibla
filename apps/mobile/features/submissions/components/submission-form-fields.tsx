import type { useForm } from "@tanstack/react-form";
import { Pressable, View } from "react-native";
import { Field } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import {
  FACILITY_OPTIONS,
  type MosqueSubmissionInput,
  TAG_OPTIONS,
} from "../lib/schemas";
import { LocationPicker } from "./location-picker";
import { PhotosField } from "./photos-field";

function fieldError(errors: unknown[]): string | undefined {
  if (!errors.length) return undefined;
  const first = errors[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "message" in first) {
    return String((first as { message: string }).message);
  }
  return undefined;
}

type AnyForm = ReturnType<
  typeof useForm<
    MosqueSubmissionInput,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >
>;

type Props = {
  form: AnyForm;
  isSubmitting: boolean;
};

export function SubmissionFormFields({ form, isSubmitting }: Props) {
  return (
    <View className="gap-s-6">
      <form.Field name="name">
        {(field) => (
          <View className="gap-s-2">
            <Text variant="label">Mosque name</Text>
            <Field
              value={field.state.value ?? ""}
              onChangeText={(v) => field.handleChange(v)}
              onBlur={field.handleBlur}
              placeholder="Baitul Mukarram"
              editable={!isSubmitting}
            />
            {fieldError(field.state.meta.errors) ? (
              <Text variant="caption" tone="danger">
                {fieldError(field.state.meta.errors)}
              </Text>
            ) : null}
          </View>
        )}
      </form.Field>

      <form.Field name="subtitle">
        {(field) => (
          <View className="gap-s-2">
            <Text variant="label">Short tagline (optional)</Text>
            <Field
              value={field.state.value ?? ""}
              onChangeText={(v) => field.handleChange(v === "" ? null : v)}
              onBlur={field.handleBlur}
              placeholder="Masjid · Est. 1968"
              editable={!isSubmitting}
            />
          </View>
        )}
      </form.Field>

      <form.Field name="lat">
        {(latField) => (
          <View className="gap-s-2">
            <form.Subscribe
              selector={(s) => [s.values.lat, s.values.lng] as const}
            >
              {([lat, lng]) => (
                <LocationPicker
                  lat={lat}
                  lng={lng}
                  onChange={(newLat, newLng) => {
                    form.setFieldValue("lat", newLat);
                    form.setFieldValue("lng", newLng);
                  }}
                />
              )}
            </form.Subscribe>
            {fieldError(latField.state.meta.errors) ? (
              <Text variant="caption" tone="danger">
                {fieldError(latField.state.meta.errors)}
              </Text>
            ) : null}
          </View>
        )}
      </form.Field>

      <form.Field name="area">
        {(field) => (
          <View className="gap-s-2">
            <Text variant="label">Area (optional)</Text>
            <Field
              value={field.state.value ?? ""}
              onChangeText={(v) => field.handleChange(v === "" ? null : v)}
              onBlur={field.handleBlur}
              placeholder="Dhanmondi"
              editable={!isSubmitting}
            />
          </View>
        )}
      </form.Field>

      <form.Field name="address">
        {(field) => (
          <View className="gap-s-2">
            <Text variant="label">Address (optional)</Text>
            <Field
              value={field.state.value ?? ""}
              onChangeText={(v) => field.handleChange(v === "" ? null : v)}
              onBlur={field.handleBlur}
              placeholder="Road 12, House 7"
              editable={!isSubmitting}
              multiline
            />
          </View>
        )}
      </form.Field>

      <View className="gap-s-3">
        <Text variant="label">Facilities</Text>
        <form.Field name="facilities">
          {(field) => (
            <View className="flex-row flex-wrap gap-s-2">
              {FACILITY_OPTIONS.map((opt) => {
                const active = field.state.value.includes(opt.value);
                return (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    active={active}
                    onPress={() => {
                      const next = active
                        ? field.state.value.filter((v) => v !== opt.value)
                        : [...field.state.value, opt.value];
                      field.handleChange(next);
                    }}
                    disabled={isSubmitting}
                  />
                );
              })}
            </View>
          )}
        </form.Field>
      </View>

      <View className="gap-s-3">
        <Text variant="label">Tags</Text>
        <form.Field name="tags">
          {(field) => (
            <View className="flex-row flex-wrap gap-s-2">
              {TAG_OPTIONS.map((tag) => {
                const active = field.state.value.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    active={active}
                    onPress={() => {
                      const next = active
                        ? field.state.value.filter((v) => v !== tag)
                        : [...field.state.value, tag];
                      field.handleChange(next);
                    }}
                    disabled={isSubmitting}
                  />
                );
              })}
            </View>
          )}
        </form.Field>
      </View>

      <form.Field name="about">
        {(field) => (
          <View className="gap-s-2">
            <Text variant="label">About (optional)</Text>
            <Field
              value={field.state.value ?? ""}
              onChangeText={(v) => field.handleChange(v === "" ? null : v)}
              onBlur={field.handleBlur}
              placeholder="A short description — history, imam, programs, etc."
              editable={!isSubmitting}
              multiline
              numberOfLines={4}
              style={{ minHeight: 90, textAlignVertical: "top" }}
            />
          </View>
        )}
      </form.Field>

      <form.Field name="photos">
        {(field) => (
          <PhotosField
            photos={field.state.value}
            onChange={(next) => field.handleChange(next)}
          />
        )}
      </form.Field>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-pill border px-s-4 py-s-2 ${
        active ? "border-green bg-green" : "border-line bg-surface"
      }`}
      style={({ pressed }) => ({ opacity: pressed || disabled ? 0.7 : 1 })}
    >
      <Text
        variant="caption"
        className={active ? "text-white" : ""}
        tone={active ? undefined : "muted"}
      >
        {label}
      </Text>
    </Pressable>
  );
}
