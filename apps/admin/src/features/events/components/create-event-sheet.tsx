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
import { EventFormFields } from "@/features/events/components/event-form-fields";
import { useCreateEvent } from "@/features/events/hooks/use-events";
import {
  type EventInput,
  eventInputSchema,
} from "@/features/events/lib/schemas";

const defaultValues: EventInput = {
  mosqueId: "",
  title: "",
  when: "",
  by: null,
  description: null,
};

export function CreateEventSheet({ mosqueId }: { mosqueId?: string }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createMutation = useCreateEvent();

  const form = useForm({
    defaultValues: mosqueId ? { ...defaultValues, mosqueId } : defaultValues,
    validators: { onChange: eventInputSchema },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync(value as EventInput);
        toast.success(`Created ${value.title}`);
        form.reset();
        setErrorMessage(null);
        setOpen(false);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not create event",
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
          New event
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
            <SheetTitle>New event</SheetTitle>
            <SheetDescription>
              Add an event scoped to a mosque. Shows up on the mosque&rsquo;s
              Events tab in the app.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1">
            <EventFormFields
              form={form}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              lockMosque={!!mosqueId}
            />
          </ScrollArea>

          <SheetFooter className="border-t px-6 py-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create event"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
