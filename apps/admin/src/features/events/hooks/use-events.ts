import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  EventInput,
  ListEventsInput,
  UpdateEventInput,
} from "@/features/events/lib/schemas";
import {
  createEventFn,
  deleteEventFn,
  getEventFn,
  listEventsFn,
  updateEventFn,
} from "@/features/events/server/events";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (input: ListEventsInput) => [...eventKeys.lists(), input] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

export function useEventList(input: ListEventsInput) {
  return useQuery({
    queryKey: eventKeys.list(input),
    queryFn: () => listEventsFn({ data: input }),
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: id ? eventKeys.detail(id) : [...eventKeys.all, "detail", "none"],
    queryFn: () => (id ? getEventFn({ data: { id } }) : null),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: EventInput) => createEventFn({ data: value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: UpdateEventInput) => updateEventFn({ data: value }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: eventKeys.all });
      qc.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEventFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}
