import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Folder } from "@/types";

/** Searchable picker for the folder a note belongs to; clearable to none. */
export function NoteFolderSelect({
  id,
  folders,
  value,
  onChange,
}: {
  id: string;
  folders: Folder[];
  value: string | undefined;
  onChange: (folderId: string | undefined) => void;
}) {
  const selectedFolder = folders.find((folder) => folder.id === value) ?? null;

  return (
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
  );
}
