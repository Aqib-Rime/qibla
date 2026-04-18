import { createContext } from "@qibla/api/context"
import { appRouter } from "@qibla/api/router"
import { RPCHandler } from "@orpc/server/fetch"
import { createFileRoute } from "@tanstack/react-router"

const rpc = new RPCHandler(appRouter)

async function handle({ request }: { request: Request }) {
  const context = await createContext(request)
  const { matched, response } = await rpc.handle(request, {
    prefix: "/api/rpc",
    context,
  })
  if (matched) return response
  return new Response("Not found", { status: 404 })
}

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})
