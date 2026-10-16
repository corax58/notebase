import { db } from "@/db";
import { folders, notes, tags } from "@/db/schema";
import { auth } from "@/lib/auth";
import { notesHref } from "@/lib/note-filters";
import { getNoteSource } from "@/lib/note-source";
import { formatRelativeDate } from "@/lib/utils";
import { AddFolderDialog } from "@/components/add-folder-dialog";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  FileIcon,
  FolderDashedIcon,
  FolderIcon,
  GlobeIcon,
  NotePencilIcon,
} from "@phosphor-icons/react/dist/ssr";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import {
  CountSkeleton,
  FolderBreakdownSkeleton,
  FolderRowsSkeleton,
  OverviewShell,
  RecentNotesSkeleton,
  TagChipsSkeleton,
} from "./_components/overview-shell";

const TOP_LIST_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Folders without a color of their own use the brand color, as elsewhere
const FALLBACK_FOLDER_COLOR = "var(--primary)";

type TopFolder = {
  id: string;
  name: string;
  color: string | null;
  noteCount: number;
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  // Started here rather than in the sections that show them, since the note
  // count and top folders each feed two sections. `.then` runs a query once
  // and hands back a plain promise that both can await.
  const noteCount = db
    .select({ value: count() })
    .from(notes)
    .where(eq(notes.userId, userId))
    .then(([row]) => row.value);
  const topFolders = db
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
    .limit(TOP_LIST_LIMIT)
    .then((rows) => rows);

  // Each section streams in when its data is back, so a slow list never
  // holds up the rest
  return (
    <OverviewShell
      noteCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count value={noteCount} />
        </Suspense>
      }
      folderCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count
            value={db
              .select({ value: count() })
              .from(folders)
              .where(eq(folders.userId, userId))
              .then(([row]) => row.value)}
          />
        </Suspense>
      }
      folderBreakdown={
        <Suspense fallback={<FolderBreakdownSkeleton />}>
          <FolderBreakdown topFolders={topFolders} noteCount={noteCount} />
        </Suspense>
      }
      tagCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count
            value={db
              .select({ value: count() })
              .from(tags)
              .where(eq(tags.userId, userId))
              .then(([row]) => row.value)}
          />
        </Suspense>
      }
      recentNotes={
        <Suspense fallback={<RecentNotesSkeleton />}>
          <RecentNotes userId={userId} />
        </Suspense>
      }
      folders={
        <Suspense fallback={<FolderRowsSkeleton />}>
          <TopFolders topFolders={topFolders} />
        </Suspense>
      }
      tags={
        <Suspense fallback={<TagChipsSkeleton />}>
          <TopTags userId={userId} />
        </Suspense>
      }
    />
  );
}

async function Count({ value }: { value: Promise<number> }) {
  return await value;
}

/**
 * How the notes split across the top folders, as one bar of segments. Notes
 * in any other folder, or in none, share the last segment.
 */
async function FolderBreakdown({
  topFolders,
  noteCount,
}: {
  topFolders: Promise<TopFolder[]>;
  noteCount: Promise<number>;
}) {
  const [shown, total] = await Promise.all([topFolders, noteCount]);
  if (total === 0) return <span className="bg-muted flex-1 rounded-[3px]" />;

  const rest = total - shown.reduce((sum, f) => sum + f.noteCount, 0);
  const segments = [
    ...shown.map((folder) => ({
      key: folder.id,
      name: folder.name,
      count: folder.noteCount,
      color: folder.color ?? FALLBACK_FOLDER_COLOR,
    })),
    { key: "rest", name: "Everything else", count: rest, color: "var(--edge)" },
  ].filter((segment) => segment.count > 0);

  return segments.map((segment) => (
    <span
      key={segment.key}
      title={`${segment.name} · ${segment.count}`}
      className="basis-0 rounded-[3px]"
      style={{ flexGrow: segment.count, background: segment.color }}
    />
  ));
}

// Calendar days on the server's clock, newest group first
function dayGroupLabel(date: Date, today: Date) {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(today) - startOfDay(date)) / DAY_MS);
  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return "Earlier";
}

async function RecentNotes({ userId }: { userId: string }) {
  const recentNotes = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    limit: TOP_LIST_LIMIT,
    with: { folder: true },
  });

  if (recentNotes.length === 0) {
    return (
      <EmptyState
        icon={NotePencilIcon}
        title="No notes yet"
        description="Save text from any page with the extension, and your latest captures will show up here."
      >
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/get-extension" />}
        >
          Get the extension
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </EmptyState>
    );
  }

  const today = new Date();
  const groups: { label: string; notes: typeof recentNotes }[] = [];
  for (const note of recentNotes) {
    const label = dayGroupLabel(note.createdAt, today);
    const group = groups.at(-1);
    if (group?.label === label) group.notes.push(note);
    else groups.push({ label, notes: [note] });
  }

  return groups.map((group) => (
    <div key={group.label} className="flex flex-col gap-0.5">
      <div className="text-muted-foreground px-3 pt-2.5 pb-1 text-xs font-semibold">
        {group.label}
      </div>
      {group.notes.map((note) => {
        const source = getNoteSource(note);
        return (
          <div
            key={note.id}
            className="hover:bg-background hover:border-edge hover:raised flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-[background-color,border-color,box-shadow] [--depth:2px]"
          >
            <span className="bg-background flex size-9 shrink-0 items-center justify-center rounded-lg border">
              {note.faviconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.faviconUrl}
                  alt=""
                  className="size-4 object-cover"
                />
              ) : source?.href ? (
                <GlobeIcon className="text-muted-foreground size-4" />
              ) : (
                <FileIcon className="text-muted-foreground size-4" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold">
                {note.label ?? note.content.slice(0, 80)}
              </span>
              <span className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-xs">
                {note.folder ? (
                  <FolderIcon
                    weight="fill"
                    className="size-3.25 shrink-0"
                    style={{
                      color: note.folder.color ?? FALLBACK_FOLDER_COLOR,
                    }}
                  />
                ) : (
                  <FolderDashedIcon className="size-3.25 shrink-0" />
                )}
                <span className="text-foreground/80 font-medium whitespace-nowrap">
                  {note.folder ? note.folder.name : "No folder"}
                </span>
                <span>·</span>
                <span className="truncate">
                  {source?.hostname ?? source?.label ?? "Added manually"}
                </span>
              </span>
            </span>
            <span
              className="text-muted-foreground shrink-0 text-xs tabular-nums"
              title={note.createdAt.toDateString()}
            >
              {formatRelativeDate(note.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  ));
}

async function TopFolders({
  topFolders,
}: {
  topFolders: Promise<TopFolder[]>;
}) {
  const rows = await topFolders;

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FolderIcon}
        title="No folders yet"
        description="Group notes by topic or project to keep them easy to find."
      >
        <AddFolderDialog />
      </EmptyState>
    );
  }

  // Bars are relative to the biggest folder, which fills its track
  const most = Math.max(...rows.map((folder) => folder.noteCount));

  return rows.map((folder) => {
    const color = folder.color ?? FALLBACK_FOLDER_COLOR;
    return (
      <Link
        key={folder.id}
        href={`/dashboard/folders/${folder.id}`}
        className="hover:bg-muted flex flex-col gap-1.75 rounded-lg px-3 py-2.25"
      >
        <span className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <FolderIcon
              weight="fill"
              className="size-4 shrink-0"
              style={{ color }}
            />
            <span className="truncate text-sm font-medium">{folder.name}</span>
          </span>
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {folder.noteCount}
          </span>
        </span>
        <span className="bg-muted block h-1 overflow-hidden rounded-full">
          <span
            className="block h-full rounded-full"
            style={{
              width: `${most ? Math.round((folder.noteCount / most) * 100) : 0}%`,
              background: color,
            }}
          />
        </span>
      </Link>
    );
  });
}

async function TopTags({ userId }: { userId: string }) {
  const topTags = await db
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
    .limit(TOP_LIST_LIMIT);

  if (topTags.length === 0) {
    return (
      <p className="text-muted-foreground flex w-full items-center justify-center text-center text-sm">
        No tags yet.
      </p>
    );
  }

  return topTags.map((tag) => (
    <Link
      key={tag.id}
      href={notesHref({ tags: [tag.name] })}
      className="bg-background border-edge pressable inline-flex h-7.5 items-center gap-1.5 rounded-[9px] border px-2.5 text-[13px] font-semibold [--depth:2px]"
    >
      <span>
        <span className="text-primary">#</span>
        {tag.name}
      </span>
      <span className="text-muted-foreground bg-muted rounded-md px-1.5 py-px text-[11px] font-semibold tabular-nums">
        {tag.noteCount}
      </span>
    </Link>
  ));
}
