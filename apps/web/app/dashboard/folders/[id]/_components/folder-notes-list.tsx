"use client";
import Link from "next/link";
import { ArrowLeftIcon, FolderIcon } from "@phosphor-icons/react/dist/ssr";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import { Folder, NoteWithRelations, Tag } from "@/lib/queries/notes";
import { NoteListItem } from "@/app/dashboard/notes/_components/note-list-item";

interface FolderNotesListProps {
  folder: { id: string; name: string; color: string | null };
  notes: NoteWithRelations[];
  userFolders: Folder[];
  userTags: Tag[];
}

const FolderNotesList = ({
  folder,
  notes,
  userFolders,
  userTags,
}: FolderNotesListProps) => {
  const { view, setView, ready } = useViewMode("notes-view");

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/folders"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        Folders
      </Link>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={
              folder.color
                ? { backgroundColor: `${folder.color}1a`, color: folder.color }
                : undefined
            }
          >
            <FolderIcon className="size-4" weight="fill" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{folder.name}</h2>
            <p className="text-muted-foreground text-sm">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <AddNoteDialog folders={userFolders} tags={userTags} />
        </div>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            No notes in this folder yet.
          </CardContent>
        </Card>
      ) : !ready ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              folders={userFolders}
              tags={userTags}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card divide-y overflow-hidden rounded-lg border">
          {notes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              folders={userFolders}
              tags={userTags}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderNotesList;
