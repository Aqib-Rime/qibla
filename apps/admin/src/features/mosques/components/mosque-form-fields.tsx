import { Badge } from "@qibla/ui/components/badge";
import { Checkbox } from "@qibla/ui/components/checkbox";
import { Input } from "@qibla/ui/components/input";
import { Label } from "@qibla/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qibla/ui/components/select";
import { Switch } from "@qibla/ui/components/switch";
import { Textarea } from "@qibla/ui/components/textarea";
import { IconAlertCircle } from "@tabler/icons-react";
import type { useForm } from "@tanstack/react-form";
import {
  FACILITY_OPTIONS,
  type MosqueInput,
  TAG_OPTIONS,
} from "@/features/mosques/lib/schemas";

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
    MosqueInput,
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

export function MosqueFormFields({
  form,
  isSubmitting,
  errorMessage,
}: {
  form: AnyForm;
  isSubmitting: boolean;
  errorMessage: string | null;
}) {
  return (
    <div className="space-y-6 px-6 pb-6 pt-4">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <IconAlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
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
        <form.Field name="subtitle">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Subtitle</Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
                placeholder="e.g. National Mosque"
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="area">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Area</Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
                placeholder="e.g. Paltan"
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="address">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Address</Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="street">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Street</Label>
              <Input
                id={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value || null)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="city">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>City</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Status</Label>
              <Select
                value={field.state.value}
                onValueChange={(v) =>
                  field.handleChange(v as MosqueInput["status"])
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id={field.name}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="lat">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Latitude</Label>
              <Input
                id={field.name}
                type="number"
                step="0.000001"
                value={field.state.value ?? 0}
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
        <form.Field name="lng">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Longitude</Label>
              <Input
                id={field.name}
                type="number"
                step="0.000001"
                value={field.state.value ?? 0}
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
      </div>

      <form.Field name="about">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>About</Label>
            <Textarea
              id={field.name}
              rows={4}
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value || null)}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="open">
        {(field) => (
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor={field.name}>Open</Label>
              <p className="text-xs text-muted-foreground">
                Currently accepting worshippers
              </p>
            </div>
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(v) => field.handleChange(v)}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="facilities" mode="array">
        {(field) => (
          <div className="space-y-2">
            <Label>Facilities</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {FACILITY_OPTIONS.map((opt) => {
                const selected = field.state.value.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 rounded-md border p-2 text-sm"
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.pushValue(opt.value);
                        } else {
                          const next = field.state.value.filter(
                            (v: string) => v !== opt.value,
                          );
                          field.setValue(next);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name="tags" mode="array">
        {(field) => (
          <div className="space-y-2 pb-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const selected = field.state.value.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (selected) {
                        field.setValue(
                          field.state.value.filter((t: string) => t !== tag),
                        );
                      } else {
                        field.pushValue(tag);
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    <Badge
                      variant={selected ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form.Field>
    </div>
  );
}
