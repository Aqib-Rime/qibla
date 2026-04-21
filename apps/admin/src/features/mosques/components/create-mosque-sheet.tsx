import { Button } from "@qibla/ui/components/button";
import { ScrollArea } from "@qibla/ui/components/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@qibla/ui/components/sheet";
import { IconPlus } from "@tabler/icons-react";
import { useForm, useStore } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { MosqueFormFields } from "@/features/mosques/components/mosque-form-fields";
import { useCreateMosque } from "@/features/mosques/hooks/use-mosques";
import {
  type MosqueInput,
  mosqueInputSchema,
} from "@/features/mosques/lib/schemas";

const defaultValues: MosqueInput = {
  name: "",
  subtitle: null,
  about: null,
  address: null,
  street: null,
  area: null,
  city: "Dhaka",
  lat: 23.7806,
  lng: 90.4078,
  open: true,
  status: "approved",
  tags: [],
  facilities: [],
  photos: [],
};

export function CreateMosqueSheet() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createMutation = useCreateMosque();

  const form = useForm({
    defaultValues,
    validators: { onChange: mosqueInputSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync(value as MosqueInput);
        toast.success(`Created ${value.name}`);
        form.reset();
        setErrorMessage(null);
        setOpen(false);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not create mosque",
        );
      }
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset();
      setErrorMessage(null);
    }
    setOpen(next);
  };

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <IconPlus className="size-4" />
          New mosque
        </Button>
      </SheetTrigger>
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
            <SheetTitle>New mosque</SheetTitle>
            <SheetDescription>
              Add a mosque to the directory. You can edit all fields later.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1">
            <MosqueFormFields
              form={form}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
            />
          </ScrollArea>

          <SheetFooter className="border-t px-6 py-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create mosque"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
