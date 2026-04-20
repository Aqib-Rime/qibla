import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth";

export const mosquesKeys = {
  all: ["mosques"] as const,
  list: (params: { pageSize?: number; search?: string } = {}) =>
    [...mosquesKeys.all, "list", params] as const,
  detail: (id: string) => [...mosquesKeys.all, "detail", id] as const,
  saved: () => [...mosquesKeys.all, "saved"] as const,
};

export function useMosquesList(
  params: { pageSize?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: mosquesKeys.list(params),
    queryFn: () => api.mosques.list({ pageSize: 50, ...params }),
  });
}

export function useMosque(id: string | undefined) {
  return useQuery({
    queryKey: mosquesKeys.detail(id ?? ""),
    queryFn: () => api.mosques.byId({ id: id as string }),
    enabled: Boolean(id),
  });
}

export function useSavedMosques() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: mosquesKeys.saved(),
    queryFn: () => api.mosques.saved(),
    enabled: Boolean(session?.user),
  });
}

export function useToggleSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mosqueId, save }: { mosqueId: string; save: boolean }) =>
      save ? api.mosques.save({ mosqueId }) : api.mosques.unsave({ mosqueId }),
    onSuccess: (_data, { mosqueId }) => {
      qc.invalidateQueries({ queryKey: mosquesKeys.saved() });
      qc.invalidateQueries({ queryKey: mosquesKeys.detail(mosqueId) });
    },
  });
}
