import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth";
import type { MosqueSubmissionInput } from "../lib/schemas";

export const submissionsKeys = {
  all: ["my-submissions"] as const,
  list: () => [...submissionsKeys.all, "list"] as const,
  detail: (id: string) => [...submissionsKeys.all, "detail", id] as const,
};

export function useMySubmissions() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: submissionsKeys.list(),
    queryFn: () => api.mosques.mine({}),
    enabled: Boolean(session?.user),
  });
}

export function useMySubmission(id: string | undefined) {
  const list = useMySubmissions();
  const row = id ? list.data?.data.find((m) => m.id === id) : undefined;
  return {
    data: row,
    isLoading: list.isLoading,
  };
}

export function useSubmitMosque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (value: MosqueSubmissionInput) => api.mosques.submit(value),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionsKeys.all }),
  });
}

export function useUpdateMySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...value }: MosqueSubmissionInput & { id: string }) =>
      api.mosques.updateMine({ id, ...value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionsKeys.all }),
  });
}

export function useDeleteMySubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.mosques.deleteMine({ id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: submissionsKeys.all }),
  });
}
