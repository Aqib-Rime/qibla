import { Input } from "@qibla/ui/components/input";
import { Label } from "@qibla/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qibla/ui/components/select";
import { Textarea } from "@qibla/ui/components/textarea";
import { IconAlertCircle } from "@tabler/icons-react";
import type { useForm } from "@tanstack/react-form";
import type { EventInput } from "@/features/events/lib/schemas";
import { useMosqueList } from "@/features/mosques/hooks/use-mosques";

function errorText(errors: unknown[]): string | undefined {
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
    EventInput,
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

export function EventFormFields({
  form,
  isSubmitting,
  errorMessage,
  lockMosque,
}: {
  form: AnyForm;
  isSubmitting: boolean;
  errorMessage: string | null;
  lockMosque?: boolean;
}) {
  const mosques = useMosqueList({ page: 1, pageSize: 100 });

  return (
    <div className="space-y-6 px-6 pb-6 pt-4">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form.Field name="mosqueId">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Mosque</Label>
            <Select
              value={field.state.value ?? ""}
              onValueChange={(v) => field.handleChange(v)}
              disabled={isSubmitting || lockMosque || mosques.isLoading}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select a mosque" />
              </SelectTrigger>
              <SelectContent>
                {mosques.data?.data.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                    {m.area ? ` — ${m.area}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorText(field.state.meta.errors) && (
              <p className="text-xs text-destructive">
                {errorText(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Friday Khutbah"
              required
              disabled={isSubmitting}
            />
            {errorText(field.state.meta.errors) && (
              <p className="text-xs text-destructive">
                {errorText(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="when">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>When</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Every Friday, 1:30 PM"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Free-text — e.g. &ldquo;Every Friday · 1:30 PM&rdquo; or
              &ldquo;2026-05-15 · 19:00&rdquo;.
            </p>
            {errorText(field.state.meta.errors) && (
              <p className="text-xs text-destructive">
                {errorText(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="by">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>By (optional)</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ""}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? null : e.target.value,
                )
              }
              onBlur={field.handleBlur}
              placeholder="Imam Siddique · Youth Committee"
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description (optional)</Label>
            <Textarea
              id={field.name}
              value={field.state.value ?? ""}
              onChange={(e) =>
                field.handleChange(
                  e.target.value === "" ? null : e.target.value,
                )
              }
              onBlur={field.handleBlur}
              placeholder="A short blurb shown on the event card."
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>
    </div>
  );
}
