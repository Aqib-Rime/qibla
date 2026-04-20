import appCss from "@qibla/ui/globals.css?url";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Providers } from "@/components/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qibla Admin" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* biome-ignore lint/style/noHeadElement: required by TanStack Start's shellComponent pattern (not a Next.js app) */}
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  );
}
