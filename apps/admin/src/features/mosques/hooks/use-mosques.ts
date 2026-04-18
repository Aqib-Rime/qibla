import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ListMosquesInput,
  MosqueInput,
  UpdateMosqueInput,
} from "@/features/mosques/lib/schemas";
import {
  createMosqueFn,
  deleteMosqueFn,
  getMosqueFn,
  listMosquesFn,
  updateMosqueFn,
} from "@/features/mosques/server/mosques";

export const mosqueKeys = {
  all: ["mosques"] as const,
  lists: () => [...mosqueKeys.all, "list"] as const,
  list: (input: ListMosquesInput) => [...mosqueKeys.lists(), input] as const,
  detail: (id: string) => [...mosqueKeys.all, "detail", id] as const,
};

export function useMosqueList(input: ListMosquesInput) {
  return useQuery({
    queryKey: mosqueKeys.list(input),
    queryFn: () => listMosquesFn({ data: input }),
  });
}

export function useMosque(id: string | undefined) {
  return useQuery({
    queryKey: id
      ? mosqueKeys.detail(id)
      : [...mosqueKeys.all, "detail", "none"],
    queryFn: () => (id ? getMosqueFn({ data: { id } }) : null),
    enabled: !!id,
  });
}

export function useCreateMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: MosqueInput) => createMosqueFn({ data: value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mosqueKeys.all }),
  });
}

export function useUpdateMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: UpdateMosqueInput) => updateMosqueFn({ data: value }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: mosqueKeys.all });
      qc.invalidateQueries({ queryKey: mosqueKeys.detail(variables.id) });
    },
  });
}

export function useDeleteMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMosqueFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mosqueKeys.all }),
  });
}
