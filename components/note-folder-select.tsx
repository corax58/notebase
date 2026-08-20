"use client"

import { CaretDownIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"

type Folder = { id: string; name: string; color: string | null }

export function NoteFolderSelect({
  folders,
  value,
  onChange,
}: {
  folders: Folder[]
  value: string | null
  onChange: (folderId: string | null) => void
}) {
  const selectedFolder = folders.find((folder) => folder.id === value)

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Folder</Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button type="button" variant="outline" className="justify-between" />
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
    </div>
  )
}
