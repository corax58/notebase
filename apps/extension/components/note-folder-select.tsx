import { CheckIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import type { Folder, NewFolder } from "@/types";

// Mirrors the presets in apps/web/components/color-picker.tsx
const FOLDER_COLORS = [
  { name: "Slate", value: "#64748b" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Yellow", value: "#eab308" },
  { name: "Lime", value: "#84cc16" },
  { name: "Green", value: "#22c55e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Pink", value: "#ec4899" },
  { name: "Rose", value: "#f43f5e" },
];

function randomFolderColor() {
  return FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)]!.value;
}

/**
 * Searchable picker for the folder a note belongs to; clearable to none.
 * With a new-folder draft it shows a name input and color swatches instead.
 */
export function NoteFolderSelect({
  id,
  folders,
  value,
  onChange,
  newFolder,
  onNewFolderChange,
}: {
  id: string;
  folders: Folder[];
  value: string | undefined;
  onChange: (folderId: string | undefined) => void;
  newFolder?: NewFolder;
  onNewFolderChange: (draft: NewFolder | undefined) => void;
}) {
  const selectedFolder = folders.find((folder) => folder.id === value) ?? null;

  if (newFolder) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            id={id}
            placeholder="e.g. Research"
            value={newFolder.name}
            onChange={(e) =>
              onNewFolderChange({ ...newFolder, name: e.target.value })
            }
            maxLength={255}
            autoFocus
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Cancel new folder"
            onClick={() => onNewFolderChange(undefined)}
          >
            <XIcon />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Folder color">
          {FOLDER_COLORS.map((color) => {
            const selected = color.value === newFolder.color;
            return (
              <button
                key={color.value}
                type="button"
                role="radio"
                aria-checked={selected}
                title={color.name}
                onClick={() =>
                  onNewFolderChange({ ...newFolder, color: color.value })
                }
                className="flex size-5 items-center justify-center rounded-full border border-border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                style={{ backgroundColor: color.value }}
              >
                {selected && (
                  <CheckIcon weight="bold" className="size-3 text-white" />
                )}
                <span className="sr-only">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <Combobox
          items={folders}
          value={selectedFolder}
          onValueChange={(folder: Folder | null) => onChange(folder?.id)}
          itemToStringLabel={(folder: Folder) => folder.name}
        >
          <ComboboxInput id={id} placeholder="No folder" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No matching folders</ComboboxEmpty>
            <ComboboxList>
              {(folder: Folder) => (
                <ComboboxItem key={folder.id} value={folder}>
                  <span className="truncate">{folder.name}</span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onNewFolderChange({ name: "", color: randomFolderColor() })
        }
      >
        <PlusIcon data-icon="inline-start" />
        New folder
      </Button>
    </div>
  );
}
