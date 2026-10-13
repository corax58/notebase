type SourceFields = {
  sourceUrl: string | null;
  sourceTitle: string | null;
};

export type NoteSource = {
  // Set only for http(s) sources; anything else is shown as plain text
  href: string | null;
  hostname: string | null;
  label: string;
};

// A note can have a source without a link, e.g. a local file saved from the
// extension keeps only its filename as the title
export function getNoteSource(note: SourceFields): NoteSource | null {
  let href: string | null = null;
  let hostname: string | null = null;

  if (note.sourceUrl) {
    try {
      const url = new URL(note.sourceUrl);
      if (url.protocol === "http:" || url.protocol === "https:") {
        href = url.href;
        hostname = url.hostname.replace(/^www\./, "");
      }
    } catch {
      // Not a URL, so it is only usable as a label
    }
  }

  const label = note.sourceTitle || hostname || note.sourceUrl;
  return label ? { href, hostname, label } : null;
}
