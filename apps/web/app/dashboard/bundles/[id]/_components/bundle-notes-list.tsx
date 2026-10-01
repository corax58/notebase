"use client";

import { NoteListItem } from "@/app/dashboard/notes/_components/note-list-item";
import { DeleteBundleAlert } from "@/components/delete-bundle-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { BundleWithNotes } from "@/lib/queries/bundles";
import type { Folder, Tag } from "@/lib/queries/notes";
import { formatRelativeDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  StackIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { CompileDialog } from "./compile-dialog";
import { DocDialog } from "./doc-dialog";
import { SortNotesDialog } from "./sort-notes-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsThreeVerticalIcon, PencilSimpleIcon } from "@phosphor-icons/react";

interface BundleNotesListProps {
  bundle: BundleWithNotes;
  userFolders: Folder[];
  userTags: Tag[];
}

const BundleNotesList = ({
  bundle,
  userFolders,
  userTags,
}: BundleNotesListProps) => {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  // Hidden optimistically until the refresh brings the server's list back
  const [removedIds, setRemovedIds] = React.useState<Set<string>>(new Set());
  const notes = bundle.notes.filter((note) => !removedIds.has(note.id));

  async function removeNote(noteId: string, noteLabel: string | null) {
    setRemovedIds((prev) => new Set(prev).add(noteId));
    try {
      const response = await fetch(
        `/api/bundles/${bundle.id}/notes/${noteId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "Something went wrong while removing the note.",
        );
      }

      toast.success(
        "Removed from bundle",
        `"${noteLabel ?? "Untitled note"}" is no longer in "${bundle.name}".`,
      );
      router.refresh();
    } catch (error) {
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.delete(noteId);
        return next;
      });
      toast.error(
        "Couldn't remove note",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/bundles"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        Bundles
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
            <StackIcon className="size-4" weight="fill" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold break-words">{bundle.name}</h2>
            <p className="text-muted-foreground text-sm">
              {notes.length} {notes.length === 1 ? "note" : "notes"} ·{" "}
              {bundle.compiledAt
                ? `compiled ${formatRelativeDate(bundle.compiledAt)}`
                : "not compiled yet"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SortNotesDialog bundleId={bundle.id} notes={notes} />
          <CompileDialog
            bundleId={bundle.id}
            lastCompileSettings={bundle.lastCompileSettings}
            noteCount={notes.length}
          />
          {bundle.docContent && (
            <DocDialog
              bundle={{ id: bundle.id, title: bundle.name }}
              docContent={bundle.docContent}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" className={"size-6"} />}
            >
              <DotsThreeVerticalIcon className="size-6" weight="bold" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/bundles/${bundle.id}/edit`)
                }
              >
                <PencilSimpleIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            This bundle has no notes.
          </CardContent>
        </Card>
      ) : (
        <ol className="bg-card divide-y overflow-hidden rounded-lg border">
          {notes.map((note, index) => (
            <li key={note.id} className="flex items-center">
              <span className="text-muted-foreground w-10 shrink-0 pl-4 text-xs font-medium tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <NoteListItem
                  note={note}
                  folders={userFolders}
                  tags={userTags}
                  onRemoveFromBundle={() => removeNote(note.id, note.label)}
                />
              </div>
            </li>
          ))}
        </ol>
      )}

      <DeleteBundleAlert
        bundleId={bundle.id}
        bundleName={bundle.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        redirectTo="/dashboard/bundles"
      />
    </div>
  );
};

export default BundleNotesList;
