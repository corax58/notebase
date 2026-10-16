"use client"

import { CaretDownIcon, PlusIcon, XIcon } from "@phosphor-icons/react"

import { ColorPicker } from "@/components/color-picker"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Folder = { id: string; name: string; color: string | null }

export type NewFolderDraft = { name: string; color: string }

export function NoteFolderSelect({
  folders,
  value,
  onChange,
  newFolder,
  onNewFolderStart,
  onNewFolderChange,
}: {
  folders: Folder[]
  value: string | null
  onChange: (folderId: string | null) => void
  // Pass these to let the user create a folder in place of picking one
  newFolder?: NewFolderDraft | null
  onNewFolderStart?: () => void
  onNewFolderChange?: (draft: NewFolderDraft | null) => void
}) {
  const selectedFolder = folders.find((folder) => folder.id === value)

  if (newFolder && onNewFolderChange) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-folder-name">New folder</Label>
        <div className="flex items-center gap-2">
          <Input
            id="new-folder-name"
            placeholder="e.g. Research"
            value={newFolder.name}
            onChange={(event) =>
              onNewFolderChange({ ...newFolder, name: event.target.value })
            }
            maxLength={255}
            required
            autoFocus
          />
          <div className="w-32 shrink-0">
            <ColorPicker
              value={newFolder.color}
              onChange={(color) => onNewFolderChange({ ...newFolder, color })}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Cancel new folder"
            onClick={() => onNewFolderChange(null)}
          >
            <XIcon />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Folder</Label>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="min-w-0 flex-1 justify-between"
              />
            }
          >
            <span className="truncate">
              {selectedFolder ? selectedFolder.name : "No folder"}
            </span>
            <CaretDownIcon
              data-icon="inline-end"
              className="text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={value ?? "none"}
              onValueChange={(next) =>
                onChange(next === "none" ? null : (next as string))
              }
            >
              <DropdownMenuRadioItem value="none">No folder</DropdownMenuRadioItem>
              {folders.map((folder) => (
                <DropdownMenuRadioItem key={folder.id} value={folder.id}>
                  {folder.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {onNewFolderStart && (
          <Button type="button" variant="outline" onClick={onNewFolderStart}>
            <PlusIcon data-icon="inline-start" />
            New folder
          </Button>
        )}
      </div>
    </div>
  )
}
