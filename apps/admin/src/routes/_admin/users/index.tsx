import { db } from "@qibla/db";
import { user } from "@qibla/db/schema/auth";
import { Badge } from "@qibla/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qibla/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { adminMiddleware } from "@/middleware/auth-middleware";

const listUsersFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(async () => {
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));
    return rows;
  });

export const Route = createFileRoute("/_admin/users/")({
  component: UsersPage,
});

function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => listUsersFn(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          {data?.length ?? 0} registered users.
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm">
                  Loading…
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-sm">
                  No users yet.
                </TableCell>
              </TableRow>
            ) : (
              data?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                    >
                      {u.role ?? "user"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
