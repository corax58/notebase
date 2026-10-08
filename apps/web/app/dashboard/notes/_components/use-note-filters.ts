"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import {
  DEFAULT_NOTE_FILTERS,
  normalizeQuery,
  notesHref,
  type NoteFilters,
} from "@/lib/note-filters";

const SEARCH_DEBOUNCE_MS = 250;

/**
 * Drives the notes page's filters. The URL is the source of truth — `filters`
 * is what the server parsed from it — and every change is a navigation, so the
 * returned `filters` run ahead of the server while `pending` is true.
 */
export function useNoteFilters(filters: NoteFilters) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [current, setCurrent] = React.useOptimistic(filters);

  // The search box holds raw keystrokes; they reach the URL once typing pauses
  const [search, setSearchText] = React.useState(filters.q);
  const [typing, setTyping] = React.useState(false);
  const [seenQuery, setSeenQuery] = React.useState(filters.q);

  // The query changed from outside the box (back/forward, a tag link) — show
  // it. Our own edits echoing back are left alone so that a trailing space
  // isn't eaten mid-phrase.
  if (current.q !== seenQuery) {
    setSeenQuery(current.q);
    if (!typing && normalizeQuery(search) !== current.q) {
      setSearchText(current.q);
    }
  }

  // Any change also commits whatever is in the search box
  function apply(patch: Partial<NoteFilters>) {
    const next = { ...current, q: normalizeQuery(search), ...patch };
    setTyping(false);
    if (notesHref(next) === notesHref(current)) return;

    startTransition(() => {
      setCurrent(next);
      router.replace(notesHref(next), { scroll: false });
    });
  }

  const applySearch = React.useEffectEvent(() => apply({}));

  React.useEffect(() => {
    if (!typing) return;
    const timeout = setTimeout(() => applySearch(), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [typing, search]);

  return {
    filters: current,
    pending,
    search,
    setSearch(value: string) {
      setSearchText(value);
      setTyping(true);
    },
    submitSearch: () => apply({}),
    clearSearch() {
      setSearchText("");
      apply({ q: "" });
    },
    update: (patch: Partial<NoteFilters>) => apply(patch),
    // Sorting isn't a filter, so it survives a reset
    reset() {
      setSearchText("");
      apply({ ...DEFAULT_NOTE_FILTERS, sort: current.sort });
    },
  };
}

export type NoteFilterControls = ReturnType<typeof useNoteFilters>;
