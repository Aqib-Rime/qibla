/**
 * Map raw field names to the user-facing labels shown in the validation toast.
 * Only required fields belong here — optional fields should never produce
 * errors that need explaining to the user.
 */
const FIELD_LABELS: Record<string, string> = {
  name: "Mosque name",
  lat: "Location",
  lng: "Location",
  city: "City",
};

type FieldMetaLike = { errors?: readonly unknown[] } | undefined;

/**
 * Walks a TanStack Form fieldMeta record and returns the user-facing labels
 * of fields that currently have validation errors. Duplicates are de-duped
 * (e.g. lat + lng both erroring maps to one "Location" entry).
 *
 * TanStack Form's fieldMeta values are typed as `AnyFieldMeta | undefined`
 * because a field may not yet have been registered; we treat those as no
 * errors via optional chaining.
 */
export function collectInvalidLabels(
  fieldMeta: Record<string, FieldMetaLike> | undefined,
): string[] {
  if (!fieldMeta) return [];
  const labels = new Set<string>();
  for (const [field, meta] of Object.entries(fieldMeta)) {
    const errorCount = meta?.errors?.length ?? 0;
    if (errorCount === 0) continue;
    const label = FIELD_LABELS[field];
    if (label) labels.add(label);
  }
  return Array.from(labels);
}
