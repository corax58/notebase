"use client";

import { PlusIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddFolder } from "@/lib/hooks/use-add-folders-form";
import ColorPicker from "./color-picker";

export function AddFolderDialog({}: {}) {
  const { open, setOpen, form, setForm, submitting, reset, handleSubmit } =
    useAddFolder();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        Add Folder
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Add a Folder</DialogTitle>
            <DialogDescription>
              Create a folder for organizing your notes.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="folder-name">Name</Label>
              <Input
                id="folder-name"
                placeholder="e.g. Research"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                required
                autoFocus
              />
            </div>

            <div className="bg- flex flex-col gap-1.5">
              <Label>Color</Label>

              <ColorPicker
                value={form.color}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, color: value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
