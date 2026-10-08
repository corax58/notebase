import * as React from "react";

/** Renders `text` with every occurrence of the search terms marked. */
export function Highlight({ text, terms }: { text: string; terms?: string[] }) {
  if (!terms?.length) return text;

  // Longest first, so "notebook" isn't cut short by a shorter term "note"
  const pattern = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  // Splitting on a capture group leaves the matches at the odd indexes
  return text.split(new RegExp(`(${pattern})`, "gi")).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="bg-primary/20 rounded-xs text-inherit">
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

/**
 * Previews are clamped to a few lines, so a match deep in a long note would
 * never be seen. Skips ahead to start the preview about `lead` characters
 * before the first match instead.
 */
export function matchExcerpt(
  text: string,
  terms: string[] | undefined,
  lead: number,
) {
  const haystack = text.toLowerCase();
  const hits = (terms ?? [])
    .map((term) => haystack.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0);
  if (hits.length === 0) return text;

  const first = Math.min(...hits);
  if (first <= lead) return text;

  // Start on a word boundary when there's one close by
  const space = text.indexOf(" ", first - lead);
  const start = space >= 0 && space < first ? space + 1 : first - lead;
  return `…${text.slice(start)}`;
}
