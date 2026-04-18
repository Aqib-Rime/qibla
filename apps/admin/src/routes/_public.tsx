import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
