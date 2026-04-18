import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const mosquesKeys = {
  all: ["mosques"] as const,
  list: (params: { pageSize?: number; search?: string } = {}) =>
    [...mosquesKeys.all, "list", params] as const,
  detail: (id: string) => [...mosquesKeys.all, "detail", id] as const,
}

export function useMosquesList(
  params: { pageSize?: number; search?: string } = {}
) {
  return useQuery({
    queryKey: mosquesKeys.list(params),
    queryFn: () => api.mosques.list({ pageSize: 50, ...params }),
  })
}

export function useMosque(id: string | undefined) {
  return useQuery({
    queryKey: mosquesKeys.detail(id ?? ""),
    queryFn: () => api.mosques.byId({ id: id as string }),
    enabled: Boolean(id),
  })
}
