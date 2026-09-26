"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  CheckIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type PickableNote = {
  id: string;
  label: string | null;
  content: string;
  sourceTitle: string | null;
  archived: boolean;
  tags: string[];
  folder: { id: string; name: string; color: string | null } | null;
};

const NewBundleForm = ({ notes }: { notes: PickableNote[] }) => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [query, setQuery] = React.useState("");
  // Ordered — this is the bundle's noteOrder
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const notesById = React.useMemo(
    () => new Map(notes.map((note) => [note.id, note])),
    [notes],
  );
  const selectedSet = new Set(selectedIds);

  const filteredNotes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((note) =>
      [
        note.label,
        note.content,
        note.sourceTitle,
        note.folder?.name,
        ...note.tags,
      ].some((value) => value?.toLowerCase().includes(q)),
    );
  }, [notes, query]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function move(index: number, delta: -1 | 1) {
    setSelectedIds((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Bundle name is required");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, noteIds: selectedIds }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const firstIssue = Object.values(body?.issues ?? {})[0] as
          | string[]
          | undefined;
        throw new Error(
          firstIssue?.[0] ??
            body?.error ??
            "Something went wrong while creating your bundle.",
        );
      }

      toast.success("Bundle created", `"${trimmed}" was saved.`);
      router.push(`/dashboard/bundles/${body.bundle.id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't create bundle",
        error instanceof Error ? error.message : "Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Link
        href="/dashboard/bundles"
        className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm hover:underline"
      >
        <ArrowLeftIcon className="size-3.5" />
        Bundles
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">New Bundle</h2>
          <p className="text-muted-foreground text-sm">
            Pick notes and arrange them in the order they should be compiled.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            nativeButton={false}
            render={<Link href="/dashboard/bundles" />}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? "Creating..." : "Create bundle"}
          </Button>
        </div>
      </div>

      <div className="flex max-w-md flex-col gap-1.5">
        <Label htmlFor="bundle-name">Name</Label>
        <Input
          id="bundle-name"
          placeholder="e.g. Thesis research"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ─── Picker ─── */}
        <section className="bg-card flex min-h-0 flex-col overflow-hidden rounded-lg border">
          <div className="flex flex-col gap-3 border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your notes</h3>
              <span className="text-muted-foreground text-xs">
                {filteredNotes.length} of {notes.length}
              </span>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search by title, content, folder or tag..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-[60vh] divide-y overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <p className="text-muted-foreground py-12 text-center text-sm">
                {notes.length === 0
                  ? "You don't have any notes yet."
                  : "No notes match your search."}
              </p>
            ) : (
              filteredNotes.map((note) => {
                const selected = selectedSet.has(note.id);
                return (
                  <button
                    key={note.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle(note.id)}
                    className={cn(
                      "hover:bg-muted/40 flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors",
                      selected && "bg-primary/5",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                        selected &&
                          "bg-primary border-primary text-primary-foreground",
                      )}
                    >
                      {selected && (
                        <CheckIcon className="size-3" weight="bold" />
                      )}
                    </span>
                    <NoteSummary note={note} />
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* ─── Order ─── */}
        <section className="bg-card flex min-h-0 flex-col overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-sm font-semibold">In this bundle</h3>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-muted-foreground hover:text-foreground text-xs hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {selectedIds.length === 0 ? (
            <p className="text-muted-foreground px-4 py-12 text-center text-sm">
              Select notes on the left to add them here.
            </p>
          ) : (
            <ol className="max-h-[60vh] divide-y overflow-y-auto">
              {selectedIds.map((id, index) => {
                const note = notesById.get(id);
                if (!note) return null;
                return (
                  <li key={id} className="flex items-start gap-3 px-4 py-3">
                    <span className="bg-muted text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-xs font-medium tabular-nums">
                      {index + 1}
                    </span>
                    <NoteSummary note={note} />
                    <div className="flex shrink-0 items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Move up"
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Move down"
                        disabled={index === selectedIds.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ArrowDownIcon />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Remove from bundle"
                        onClick={() => toggle(id)}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </form>
  );
};

function NoteSummary({ note }: { note: PickableNote }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="truncate text-sm font-medium">
          {note.label ?? "Untitled note"}
        </span>
        {note.archived && <Badge variant="outline">Archived</Badge>}
      </div>
      <p className="text-muted-foreground line-clamp-1 text-xs">
        {note.content}
      </p>
      {note.folder && (
        <span
          className="text-muted-foreground flex items-center gap-1 text-xs"
          style={note.folder.color ? { color: note.folder.color } : undefined}
        >
          <FolderIcon className="size-3" weight="fill" />
          {note.folder.name}
        </span>
      )}
    </div>
  );
}

export default NewBundleForm;
