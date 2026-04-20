import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@qibla/api";

export type { AppRouter };

export type QiblaClient = RouterClient<AppRouter>;

type HeadersRecord = Record<string, string | string[] | undefined>;

export function createQiblaClient(options: {
  baseURL: string;
  headers?: HeadersRecord | (() => HeadersRecord | Promise<HeadersRecord>);
  fetch?: typeof fetch;
}): QiblaClient {
  const link = new RPCLink({
    url: `${options.baseURL.replace(/\/$/, "")}/api/rpc`,
    headers: options.headers,
    fetch: options.fetch,
  });

  return createORPCClient<QiblaClient>(link);
}
