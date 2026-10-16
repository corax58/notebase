import Link from "next/link";
import { FolderDashedIcon, FolderIcon } from "@phosphor-icons/react/dist/ssr";
import { folderColor } from "@/components/folder-chip";
import { cn } from "@/lib/utils";

const pillClassName =
  "inline-flex h-6 max-w-full min-w-0 items-center gap-1.25 rounded-[7px] px-2 text-xs font-semibold";

/**
 * The folder a note is in, tinted with the folder's color. The text is the
 * color darkened (lightened in the dark theme) so it stays readable.
 */
export function NoteFolderPill({
  folder,
  href,
  className,
}: {
  folder: { id: string; name: string; color: string | null } | null;
  // Where the pill leads; the folder's own page unless set
  href?: string;
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
    <Link
      href={href ?? `/dashboard/folders/${folder.id}`}
      style={{ "--folder": folderColor(folder) } as React.CSSProperties}
      className={cn(
        pillClassName,
        "bg-[color-mix(in_oklch,var(--folder)_13%,transparent)] text-[color-mix(in_oklch,var(--folder),black_45%)] hover:bg-[color-mix(in_oklch,var(--folder)_20%,transparent)] dark:text-[color-mix(in_oklch,var(--folder),white_35%)]",
        className,
      )}
    >
      <FolderIcon
        weight="fill"
        className="size-3.25 shrink-0 text-(--folder)"
      />
      <span className="truncate">{folder.name}</span>
    </Link>
  );
}
