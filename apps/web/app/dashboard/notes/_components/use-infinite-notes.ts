"use client";

import * as React from "react";
import {
  NOTES_MAX_BATCH,
  NOTES_PAGE_SIZE,
  noteFilterParams,
  type NoteFilters,
} from "@/lib/note-filters";
import type { NoteWithRelations } from "@/lib/queries/notes";

type NotesRange = { notes: NoteWithRelations[]; total: number };

// JSON carries dates as strings, while the notes the page was rendered with
// hold real ones
function reviveNote(note: NoteWithRelations): NoteWithRelations {
  return {
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
    folder: note.folder && {
      ...note.folder,
      createdAt: new Date(note.folder.createdAt),
      updatedAt: new Date(note.folder.updatedAt),
    },
  };
}

async function fetchRange(
  query: string,
  offset: number,
  count: number,
  signal: AbortSignal,
): Promise<NotesRange> {
  const notes: NoteWithRelations[] = [];
  let total = 0;

  // A long stretch takes more than one request
  while (notes.length < count) {
    const limit = Math.min(count - notes.length, NOTES_MAX_BATCH);
    const params = new URLSearchParams(query);
    params.set("offset", String(offset + notes.length));
    params.set("limit", String(limit));

    const response = await fetch(`/api/notes/search?${params}`, { signal });
    if (!response.ok) {
      throw new Error(`Loading notes failed with ${response.status}`);
    }

    const body: NotesRange = await response.json();
    notes.push(...body.notes.map(reviveNote));
    total = body.total;
    if (body.notes.length < limit) break;
  }

  return { notes, total };
}

/**
 * Grows the notes list past the first page as it's scrolled. That first page
 * stays the server's: everything that changes a note refreshes the route, and
 * when a fresh first page comes in, the notes loaded after it are fetched
 * again so the two never disagree for long.
 */
export function useInfiniteNotes(
  firstPage: NoteWithRelations[],
  total: number,
  filters: NoteFilters,
) {
  const query = noteFilterParams(filters).toString();
  const [more, setMore] = React.useState<NoteWithRelations[]>([]);
  // The server's count to begin with, then whatever the latest request saw
  const [knownTotal, setKnownTotal] = React.useState(total);
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "syncing" | "error"
  >("idle");
  const request = React.useRef<AbortController | null>(null);

  // New filters start over from the first page; the same filters coming back
  // from the server keep what was loaded until the effect below replaces it
  const [seen, setSeen] = React.useState({ firstPage, query });
  if (seen.firstPage !== firstPage) {
    const kept = seen.query === query ? more : [];
    setSeen({ firstPage, query });
    setMore(kept);
    setKnownTotal(total);
    setStatus(kept.length > 0 ? "syncing" : "idle");
  }

  async function load(offset: number, count: number, replace: boolean) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;

    try {
      const range = await fetchRange(query, offset, count, controller.signal);
      if (controller.signal.aborted) return;
      setMore((loaded) =>
        replace ? range.notes : [...loaded, ...range.notes],
      );
      setKnownTotal(range.total);
      setStatus("idle");
    } catch {
      if (controller.signal.aborted) return;
      // Notes that can't be brought up to date go, rather than linger stale
      if (replace) setMore([]);
      setStatus(replace ? "idle" : "error");
    }
  }

  const sync = React.useEffectEvent(() => {
    if (more.length > 0) load(firstPage.length, more.length, true);
  });

  React.useEffect(() => {
    sync();
    return () => request.current?.abort();
  }, [firstPage]);

  const loaded = firstPage.length + more.length;
  const hasMore = loaded < knownTotal;

  // Notes added or deleted between requests shift the rest along, so one can
  // turn up on both sides of a seam
  const notes = React.useMemo(() => {
    const ids = new Set<string>();
    return [...firstPage, ...more].filter((note) => {
      if (ids.has(note.id)) return false;
      ids.add(note.id);
      return true;
    });
  }, [firstPage, more]);

  return {
    notes,
    canLoadMore: hasMore && status === "idle",
    loadingMore: status === "loading",
    failed: status === "error",
    loadMore() {
      if (!hasMore || status === "loading" || status === "syncing") return;
      setStatus("loading");
      load(loaded, NOTES_PAGE_SIZE, false);
    },
  };
}
