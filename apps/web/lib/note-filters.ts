// URL-backed filter state for the notes page. The server page parses it out of
// searchParams, the toolbar writes it back — so every view is a shareable link
// and nothing here may import server-only code.

// How many notes the page renders up front, and how many each scroll adds
export const NOTES_PAGE_SIZE = 48;
// The most notes a single request for more of the list can ask for
export const NOTES_MAX_BATCH = 240;

// Stands in for a folder id to mean "notes that aren't in any folder"
export const NO_FOLDER = "none";

const MAX_QUERY_LENGTH = 200;
const MAX_SEARCH_TERMS = 8;
const MAX_FACET_VALUES = 50;

// The first option of each list is its default, and is left out of the URL
export const NOTE_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "updated", label: "Recently updated" },
  { value: "title", label: "Title A–Z" },
] as const;

export const NOTE_CREATED_OPTIONS = [
  { value: "any", label: "Any time", days: null },
  { value: "24h", label: "Last 24 hours", days: 1 },
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "90d", label: "Last 90 days", days: 90 },
  { value: "1y", label: "Last year", days: 365 },
] as const;

export const NOTE_SOURCE_OPTIONS = [
  { value: "any", label: "Any source" },
  { value: "web", label: "From the web" },
  { value: "manual", label: "Added manually" },
] as const;

export const NOTE_STATUS_OPTIONS = [
  { value: "all", label: "All notes" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
] as const;

export type NoteSort = (typeof NOTE_SORT_OPTIONS)[number]["value"];
export type NoteCreated = (typeof NOTE_CREATED_OPTIONS)[number]["value"];
export type NoteSource = (typeof NOTE_SOURCE_OPTIONS)[number]["value"];
export type NoteStatus = (typeof NOTE_STATUS_OPTIONS)[number]["value"];

export type NoteFilters = {
  q: string;
  // Folder ids, and/or NO_FOLDER
  folders: string[];
  tags: string[];
  // Whether a note needs any of the selected tags or all of them
  tagMatch: "any" | "all";
  created: NoteCreated;
  source: NoteSource;
  status: NoteStatus;
  sort: NoteSort;
};

export const DEFAULT_NOTE_FILTERS: NoteFilters = {
  q: "",
  folders: [],
  tags: [],
  tagMatch: "any",
  created: "any",
  source: "any",
  status: "all",
  sort: "newest",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function all(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function oneOf<T extends string>(
  options: readonly { value: T }[],
  raw: string | undefined,
) {
  return (
    options.find((option) => option.value === raw)?.value ?? options[0].value
  );
}

export function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH);
}

// URLs get hand-edited and go stale, so anything unreadable falls back to its
// default instead of failing the page
export function parseNoteFilters(params: RawSearchParams): NoteFilters {
  return {
    q: normalizeQuery(first(params.q) ?? ""),
    folders: [
      ...new Set(
        all(params.folder).filter(
          (id) => id === NO_FOLDER || UUID_PATTERN.test(id),
        ),
      ),
    ].slice(0, MAX_FACET_VALUES),
    tags: [
      ...new Set(
        all(params.tag)
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ].slice(0, MAX_FACET_VALUES),
    tagMatch: first(params.match) === "all" ? "all" : "any",
    created: oneOf(NOTE_CREATED_OPTIONS, first(params.created)),
    source: oneOf(NOTE_SOURCE_OPTIONS, first(params.source)),
    status: oneOf(NOTE_STATUS_OPTIONS, first(params.status)),
    sort: oneOf(NOTE_SORT_OPTIONS, first(params.sort)),
  };
}

export function noteFilterParams(filters: Partial<NoteFilters> = {}) {
  const f = { ...DEFAULT_NOTE_FILTERS, ...filters };
  const params = new URLSearchParams();

  if (f.q) params.set("q", f.q);
  for (const id of f.folders) params.append("folder", id);
  for (const tag of f.tags) params.append("tag", tag);
  if (f.tagMatch === "all" && f.tags.length > 1) params.set("match", "all");
  if (f.created !== DEFAULT_NOTE_FILTERS.created) {
    params.set("created", f.created);
  }
  if (f.source !== DEFAULT_NOTE_FILTERS.source) params.set("source", f.source);
  if (f.status !== DEFAULT_NOTE_FILTERS.status) params.set("status", f.status);
  if (f.sort !== DEFAULT_NOTE_FILTERS.sort) params.set("sort", f.sort);

  return params;
}

export function notesHref(filters: Partial<NoteFilters> = {}) {
  const query = noteFilterParams(filters).toString();
  return query ? `/dashboard/notes?${query}` : "/dashboard/notes";
}

// Sorting changes the order of the results, not which notes match
export function hasActiveFilters(filters: NoteFilters) {
  return (
    filters.q !== "" ||
    filters.folders.length > 0 ||
    filters.tags.length > 0 ||
    filters.created !== DEFAULT_NOTE_FILTERS.created ||
    filters.source !== DEFAULT_NOTE_FILTERS.source ||
    filters.status !== DEFAULT_NOTE_FILTERS.status
  );
}

// Splits a query into words that all have to match. A word written as #name
// only looks at tags; anything else is matched against the whole note.
export function parseSearchTerms(query: string) {
  const text: string[] = [];
  const tags: string[] = [];

  for (const word of query
    .split(" ")
    .filter(Boolean)
    .slice(0, MAX_SEARCH_TERMS)) {
    if (word.length > 1 && word.startsWith("#")) tags.push(word.slice(1));
    else text.push(word);
  }

  return { text, tags };
}
