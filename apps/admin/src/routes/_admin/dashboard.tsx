import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import { event, mosque, review } from "@qibla/db/schema/mosque";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qibla/ui/components/card";
import {
  IconBuildingMosque,
  IconCalendarEvent,
  IconMessageCircle2,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { count, eq } from "drizzle-orm";

const getDashboardStatsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const [mosqueCount] = await db.select({ value: count() }).from(mosque);
    const [eventCount] = await db.select({ value: count() }).from(event);
    const [userCount] = await db.select({ value: count() }).from(user);
    const [pendingReviewCount] = await db
      .select({ value: count() })
      .from(review)
      .where(eq(review.status, "pending"));
    const [pendingMosqueCount] = await db
      .select({ value: count() })
      .from(mosque)
      .where(eq(mosque.status, "pending"));

    return {
      mosques: mosqueCount?.value ?? 0,
      events: eventCount?.value ?? 0,
      users: userCount?.value ?? 0,
      pendingReviews: pendingReviewCount?.value ?? 0,
      pendingMosques: pendingMosqueCount?.value ?? 0,
    };
  },
);

export const Route = createFileRoute("/_admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStatsFn(),
  });

  const stats = [
    {
      label: "Mosques",
      value: data?.mosques ?? "—",
      icon: IconBuildingMosque,
      description: `${data?.pendingMosques ?? 0} pending`,
    },
    {
      label: "Events",
      value: data?.events ?? "—",
      icon: IconCalendarEvent,
      description: "Across all mosques",
    },
    {
      label: "Pending reviews",
      value: data?.pendingReviews ?? "—",
      icon: IconMessageCircle2,
      description: "Awaiting moderation",
    },
    {
      label: "Users",
      value: data?.users ?? "—",
      icon: IconUsers,
      description: "Total registered",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Snapshot of mosques, events, and moderation queue.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <CardDescription className="pt-1 text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
