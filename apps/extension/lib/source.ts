import type { CreateNote } from "@/types";

type NoteSource = Pick<CreateNote, "sourceUrl" | "sourceTitle" | "faviconUrl">;

interface SourceTab {
  url?: string;
  title?: string;
  favIconUrl?: string;
}

function fileName(url: URL) {
  const name = url.pathname.split("/").filter(Boolean).pop();
  if (!name) return undefined;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

// Only web pages are stored as linkable sources. Local files keep just their
// filename, and browser-internal pages (blob:, data:, chrome:, about:,
// view-source:, moz-extension:, ...) carry no source at all.
export function sourceFromTab(tab?: SourceTab): NoteSource {
  let url: URL;
  try {
    url = new URL(tab?.url ?? "");
  } catch {
    return {};
  }

  if (url.protocol === "http:" || url.protocol === "https:") {
    return {
      sourceUrl: url.href,
      sourceTitle: tab?.title || undefined,
      faviconUrl: tab?.favIconUrl || undefined,
    };
  }

  if (url.protocol === "file:") {
    return { sourceTitle: fileName(url) };
  }

  return {};
}
