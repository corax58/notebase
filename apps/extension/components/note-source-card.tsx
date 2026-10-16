import { GlobeIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

/** Preview of the page a note was captured from, with a button to detach it. */
export function NoteSourceCard({
  faviconUrl,
  sourceTitle,
  sourceUrl,
  onRemove,
}: {
  faviconUrl?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card py-2 pr-1.5 pl-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-background">
        {faviconUrl ? (
          <img src={faviconUrl} alt="" className="size-4" />
        ) : (
          <GlobeIcon className="size-4 text-muted-foreground" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs">
        {sourceTitle && (
          <span className="truncate font-medium text-foreground">
            {sourceTitle}
          </span>
        )}
        {sourceUrl && (
          <span className="truncate text-muted-foreground">{sourceUrl}</span>
        )}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Remove source"
        className="text-muted-foreground"
        onClick={onRemove}
      >
        <XIcon />
      </Button>
    </div>
  );
}
