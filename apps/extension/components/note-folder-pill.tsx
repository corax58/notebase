import type { CSSProperties } from "react";
import { FolderDashedIcon, FolderIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const pillClassName =
  "inline-flex h-6 max-w-full min-w-0 items-center gap-1.25 rounded-[7px] px-2 text-xs font-semibold";

/**
 * The folder a note is in, tinted with the folder's color, as in the web app.
 * The text is the color darkened (lightened in the dark theme) so it stays
 * readable.
 */
export function NoteFolderPill({
  folder,
  className,
}: {
  folder: { name: string; color: string | null } | null;
  className?: string;
}) {
  if (!folder) {
    return (
      <span
        className={cn(
          pillClassName,
          "bg-muted text-muted-foreground",
          className,
        )}
      >
        <FolderDashedIcon className="size-3.25 shrink-0" />
        <span className="truncate">No folder</span>
      </span>
    );
  }

  return (
    <span
      style={{ "--folder": folder.color ?? "var(--primary)" } as CSSProperties}
      className={cn(
        pillClassName,
        "bg-[color-mix(in_oklch,var(--folder)_13%,transparent)] text-[color-mix(in_oklch,var(--folder),black_45%)] dark:text-[color-mix(in_oklch,var(--folder),white_35%)]",
        className,
      )}
    >
      <FolderIcon
        weight="fill"
        className="size-3.25 shrink-0 text-(--folder)"
      />
      <span className="truncate">{folder.name}</span>
    </span>
  );
}
