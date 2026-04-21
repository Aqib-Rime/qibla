import { Button } from "@qibla/ui/components/button";
import { ScrollArea } from "@qibla/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@qibla/ui/components/sheet";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MosqueFormFields } from "@/features/mosques/components/mosque-form-fields";
import {
  useMosque,
  useUpdateMosque,
} from "@/features/mosques/hooks/use-mosques";
import {
  type MosqueInput,
  mosqueInputSchema,
} from "@/features/mosques/lib/schemas";

type Props = {
  mosqueId: string | null;
  onClose: () => void;
};

const placeholder: MosqueInput = {
  name: "",
  subtitle: null,
  about: null,
  address: null,
  street: null,
  area: null,
  city: "Dhaka",
  lat: 0,
  lng: 0,
  open: true,
  status: "approved",
  tags: [],
  facilities: [],
  photos: [],
};

export function EditMosqueSheet({ mosqueId, onClose }: Props) {
  const { data: mosque } = useMosque(mosqueId ?? undefined);
  const updateMutation = useUpdateMosque();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: placeholder,
    validators: { onChange: mosqueInputSchema },
    onSubmit: async ({ value }) => {
      if (!mosqueId) return;
      try {
        await updateMutation.mutateAsync({
          id: mosqueId,
          ...(value as MosqueInput),
        });
        toast.success("Saved");
        setErrorMessage(null);
        onClose();
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not save mosque",
        );
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: form from useForm is stable; re-running on form identity would loop
  useEffect(() => {
    if (!mosque) return;
    form.reset({
      name: mosque.name,
      subtitle: mosque.subtitle ?? null,
      about: mosque.about ?? null,
      address: mosque.address ?? null,
      street: mosque.street ?? null,
      area: mosque.area ?? null,
      city: mosque.city,
      lat: mosque.lat,
      lng: mosque.lng,
      open: mosque.open,
      status: mosque.status,
      tags: mosque.tags ?? [],
      facilities: mosque.facilities ?? [],
      photos: mosque.photos ?? [],
    });
    setErrorMessage(null);
  }, [mosque]);

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <Sheet open={!!mosqueId} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex h-full flex-col"
          noValidate
        >
          <SheetHeader className="shrink-0 border-b px-6 pb-4 pt-6">
            <SheetTitle>Edit {mosque?.name ?? "mosque"}</SheetTitle>
            <SheetDescription>
              Update details. Changes apply immediately.
            </SheetDescription>
          </SheetHeader>

          {mosque ? (
            <ScrollArea className="min-h-0 flex-1">
              <MosqueFormFields
                form={form}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
              />
            </ScrollArea>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          )}

          <SheetFooter className="border-t px-6 py-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !mosque}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
