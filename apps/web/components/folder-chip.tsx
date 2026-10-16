import { FolderIcon } from "@phosphor-icons/react/dist/ssr";

// Folders without a color of their own use the brand color
export function folderColor(folder: { color: string | null }) {
  return folder.color ?? "var(--primary)";
}

/** The folder's icon on a tile tinted with its color. */
export function FolderChip({ color }: { color: string }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border"
      style={{
        backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)`,
        borderColor: `color-mix(in oklch, ${color} 30%, transparent)`,
        color,
      }}
    >
      <FolderIcon className="size-4" weight="fill" />
    </span>
  );
}
