import { Separator } from "@qibla/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@qibla/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/features/admin-sidebar/admin-sidebar";
import { getSessionFn } from "@/lib/session";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async () => {
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({ to: "/sign-in" });
    }
    if (session.user.role !== "admin") {
      throw redirect({ to: "/sign-in" });
    }
    return { session };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { session } = Route.useRouteContext();
  return (
    <SidebarProvider>
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-sm font-medium">Qibla Admin</h1>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
