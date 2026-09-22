"use client";
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, useViewMode } from "@/components/view-toggle";
import { Folder, NoteWithRelations, Tag } from "@/lib/queries/notes";
import { NoteListItem } from "./note-list-item";

interface NotesListProps {
  notes: NoteWithRelations[];
  userFolders: Folder[];
  userTags: Tag[];
}

const NotesList = ({ notes, userFolders, userTags }: NotesListProps) => {
  const { view, setView, ready } = useViewMode("notes-view");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="text-muted-foreground text-sm">
            {notes.length} {notes.length === 1 ? "note" : "notes"} · newest
            first
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <AddNoteDialog folders={userFolders} tags={userTags} />
        </div>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            No notes yet.
          </CardContent>
        </Card>
      ) : !ready ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-md" />
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
        <div className="bg-card divide-y overflow-hidden rounded-md border">
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

export default NotesList;
