import { Button } from "@qibla/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qibla/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@qibla/ui/components/sidebar";
import { IconLogout, IconMoon } from "@tabler/icons-react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { navItems } from "@/features/admin-sidebar/nav-items";
import { authClient } from "@/lib/auth-client";

export function AdminSidebar({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const router = useRouter();
  const { location } = useRouterState();

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out");
    router.navigate({ to: "/sign-in" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-semibold">Q</span>
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Qibla Admin</span>
            <span className="text-xs text-muted-foreground">Dhaka</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active =
                  location.pathname === item.url ||
                  location.pathname.startsWith(`${item.url}/`);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-2 py-2"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-col items-start leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem disabled>
              <IconMoon className="mr-2 size-4" /> Theme (coming soon)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <IconLogout className="mr-2 size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
