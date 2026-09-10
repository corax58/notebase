import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { folders, notes, tags } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  ArrowRightIcon,
  FolderIcon,
  NotePencilIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import { count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [[noteCount], [folderCount], [tagCount], recentNotes] =
    await Promise.all([
      db.select({ value: count() }).from(notes).where(eq(notes.userId, userId)),
      db
        .select({ value: count() })
        .from(folders)
        .where(eq(folders.userId, userId)),
      db.select({ value: count() }).from(tags).where(eq(tags.userId, userId)),
      db.query.notes.findMany({
        where: eq(notes.userId, userId),
        orderBy: desc(notes.createdAt),
        limit: 5,
        with: { folder: true },
      }),
    ]);

  const stats = [
    {
      label: "Notes",
      value: noteCount.value,
      icon: NotePencilIcon,
      href: "/dashboard/notes",
    },
    {
      label: "Folders",
      value: folderCount.value,
      icon: FolderIcon,
      href: "/dashboard/folders",
    },
    {
      label: "Tags",
      value: tagCount.value,
      icon: TagIcon,
      href: "/dashboard/tags",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card
              size="sm"
              className="hover:bg-muted/50 rounded-xs transition-colors"
            >
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="bg-primary/10 text-primary border-primary flex size-10 items-center justify-center rounded-lg border">
                  <stat.icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="rounded-xs">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Recent notes</CardTitle>
            <CardDescription>
              Your latest captures, newest first.
            </CardDescription>
          </div>
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/dashboard/notes" />}
          >
            View all
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {recentNotes.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No notes yet. Once you capture something, it&apos;ll show up here.
            </p>
          ) : (
            recentNotes.map((note) => (
              <div
                key={note.id}
                className="hover:bg-muted flex items-center justify-between gap-4 rounded-xs px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {note.label ?? note.content.slice(0, 80)}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {note.folder ? note.folder.name : "No folder"} ·{" "}
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
