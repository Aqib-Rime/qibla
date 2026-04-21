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
import { EventFormFields } from "@/features/events/components/event-form-fields";
import { useEvent, useUpdateEvent } from "@/features/events/hooks/use-events";
import {
  type EventInput,
  eventInputSchema,
} from "@/features/events/lib/schemas";

type Props = {
  eventId: string | null;
  onClose: () => void;
};

const placeholder: EventInput = {
  mosqueId: "",
  title: "",
  when: "",
  by: null,
  description: null,
};

export function EditEventSheet({ eventId, onClose }: Props) {
  const { data: ev } = useEvent(eventId ?? undefined);
  const updateMutation = useUpdateEvent();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: placeholder,
    validators: { onChange: eventInputSchema },
    onSubmit: async ({ value }) => {
      if (!eventId) return;
      try {
        await updateMutation.mutateAsync({
          id: eventId,
          ...(value as EventInput),
        });
        toast.success("Saved");
        setErrorMessage(null);
        onClose();
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not save event",
        );
      }
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: form from useForm is stable; re-running on form identity would loop
  useEffect(() => {
    if (!ev) return;
    form.reset({
      mosqueId: ev.mosqueId,
      title: ev.title,
      when: ev.when,
      by: ev.by ?? null,
      description: ev.description ?? null,
    });
    setErrorMessage(null);
  }, [ev]);

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <Sheet open={!!eventId} onOpenChange={handleOpenChange}>
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
            <SheetTitle>Edit {ev?.title ?? "event"}</SheetTitle>
            <SheetDescription>
              Update details. Changes apply immediately.
            </SheetDescription>
          </SheetHeader>

          {ev ? (
            <ScrollArea className="min-h-0 flex-1">
              <EventFormFields
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
              disabled={isSubmitting || !ev}
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
