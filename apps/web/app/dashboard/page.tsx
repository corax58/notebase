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
import { and, count, desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";

const TOP_LIST_LIMIT = 5;

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  const [
    [noteCount],
    [folderCount],
    [tagCount],
    recentNotes,
    topFolders,
    topTags,
  ] = await Promise.all([
    db.select({ value: count() }).from(notes).where(eq(notes.userId, userId)),
    db
      .select({ value: count() })
      .from(folders)
      .where(eq(folders.userId, userId)),
    db.select({ value: count() }).from(tags).where(eq(tags.userId, userId)),
    db.query.notes.findMany({
      where: eq(notes.userId, userId),
      orderBy: desc(notes.createdAt),
      limit: TOP_LIST_LIMIT,
      with: { folder: true },
    }),
    db
      .select({
        id: folders.id,
        name: folders.name,
        color: folders.color,
        noteCount: count(notes.id),
      })
      .from(folders)
      .leftJoin(notes, eq(notes.folderId, folders.id))
      .where(eq(folders.userId, userId))
      .groupBy(folders.id)
      .orderBy(desc(count(notes.id)))
      .limit(TOP_LIST_LIMIT),
    db
      .select({
        id: tags.id,
        name: tags.name,
        noteCount: count(notes.id),
      })
      .from(tags)
      .leftJoin(
        notes,
        and(
          eq(notes.userId, tags.userId),
          sql`${notes.tags} @> ARRAY[${tags.name}]::text[]`,
        ),
      )
      .where(eq(tags.userId, userId))
      .groupBy(tags.id)
      .orderBy(desc(count(notes.id)))
      .limit(TOP_LIST_LIMIT),
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
              className="hover:bg-muted/50 rounded-lg transition-colors"
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-lg md:col-span-2">
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
                No notes yet. Once you capture something, it&apos;ll show up
                here.
              </p>
            ) : (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="hover:bg-muted flex items-center justify-between gap-4 rounded-lg px-3 py-2.5"
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

        <div className="flex flex-col gap-6">
          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Folders</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                nativeButton={false}
                render={<Link href="/dashboard/folders" />}
              >
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {topFolders.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No folders yet.
                </p>
              ) : (
                topFolders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folders/${folder.id}`}
                    className="hover:bg-muted flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FolderIcon
                        weight="fill"
                        className="text-primary size-4 shrink-0"
                        style={
                          folder.color ? { color: folder.color } : undefined
                        }
                      />
                      <span className="truncate text-sm font-medium">
                        {folder.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {folder.noteCount}
                    </span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Tags</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                nativeButton={false}
                render={<Link href="/dashboard/tags" />}
              >
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {topTags.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No tags yet.
                </p>
              ) : (
                topTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <TagIcon className="text-primary size-4 shrink-0" />
                      <span className="truncate text-sm font-medium">
                        {tag.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {tag.noteCount}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
