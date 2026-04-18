import {
  IconBuildingMosque,
  IconCalendarEvent,
  IconLayoutDashboard,
  IconMessageCircle2,
  IconUsers,
} from "@tabler/icons-react";

export type NavItem = {
  title: string;
  url: "/dashboard" | "/mosques" | "/events" | "/reviews" | "/users";
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
  { title: "Mosques", url: "/mosques", icon: IconBuildingMosque },
  { title: "Events", url: "/events", icon: IconCalendarEvent },
  { title: "Reviews", url: "/reviews", icon: IconMessageCircle2 },
  { title: "Users", url: "/users", icon: IconUsers },
];
