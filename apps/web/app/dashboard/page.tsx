import { db } from "@/db";
import { folders, notes, tags } from "@/db/schema";
import { auth } from "@/lib/auth";
import { notesHref } from "@/lib/note-filters";
import { FolderIcon, TagIcon } from "@phosphor-icons/react/dist/ssr";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import {
  CountedRowsSkeleton,
  CountSkeleton,
  OverviewShell,
  RecentNotesSkeleton,
} from "./_components/overview-shell";

const TOP_LIST_LIMIT = 5;

type SectionProps = { userId: string };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user.id;

  // Each section runs its own query and streams in when that one is back,
  // so a slow list never holds up the rest
  return (
    <OverviewShell
      noteCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count
            rows={db
              .select({ value: count() })
              .from(notes)
              .where(eq(notes.userId, userId))}
          />
        </Suspense>
      }
      folderCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count
            rows={db
              .select({ value: count() })
              .from(folders)
              .where(eq(folders.userId, userId))}
          />
        </Suspense>
      }
      tagCount={
        <Suspense fallback={<CountSkeleton />}>
          <Count
            rows={db
              .select({ value: count() })
              .from(tags)
              .where(eq(tags.userId, userId))}
          />
        </Suspense>
      }
      recentNotes={
        <Suspense fallback={<RecentNotesSkeleton />}>
          <RecentNotes userId={userId} />
        </Suspense>
      }
      folders={
        <Suspense fallback={<CountedRowsSkeleton />}>
          <TopFolders userId={userId} />
        </Suspense>
      }
      tags={
        <Suspense fallback={<CountedRowsSkeleton />}>
          <TopTags userId={userId} />
        </Suspense>
      }
    />
  );
}

async function Count({ rows }: { rows: PromiseLike<{ value: number }[]> }) {
  const [row] = await rows;
  return row.value;
}

async function RecentNotes({ userId }: SectionProps) {
  const recentNotes = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: desc(notes.createdAt),
    limit: TOP_LIST_LIMIT,
    with: { folder: true },
  });

  if (recentNotes.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No notes yet. Once you capture something, it&apos;ll show up here.
      </p>
    );
  }

  return recentNotes.map((note) => (
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
  ));
}

async function TopFolders({ userId }: SectionProps) {
  const topFolders = await db
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
    .limit(TOP_LIST_LIMIT);

  if (topFolders.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No folders yet.
      </p>
    );
  }

  return topFolders.map((folder) => (
    <Link
      key={folder.id}
      href={`/dashboard/folders/${folder.id}`}
      className="hover:bg-muted flex items-center justify-between gap-2 rounded-lg px-3 py-2"
    >
      <div className="flex min-w-0 items-center gap-2">
        <FolderIcon
          weight="fill"
          className="text-primary size-4 shrink-0"
          style={folder.color ? { color: folder.color } : undefined}
        />
        <span className="truncate text-sm font-medium">{folder.name}</span>
      </div>
      <span className="text-muted-foreground shrink-0 text-xs">
        {folder.noteCount}
      </span>
    </Link>
  ));
}

async function TopTags({ userId }: SectionProps) {
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
      <p className="text-muted-foreground py-4 text-center text-sm">
        No tags yet.
      </p>
    );
  }

  return topTags.map((tag) => (
    <Link
      key={tag.id}
      href={notesHref({ tags: [tag.name] })}
      className="hover:bg-muted flex items-center justify-between gap-2 rounded-lg px-3 py-2"
    >
      <div className="flex min-w-0 items-center gap-2">
        <TagIcon className="text-primary size-4 shrink-0" />
        <span className="truncate text-sm font-medium">{tag.name}</span>
      </div>
      <span className="text-muted-foreground shrink-0 text-xs">
        {tag.noteCount}
      </span>
    </Link>
  ));
}
