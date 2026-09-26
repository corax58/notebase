"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDownIcon,
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
  DotsSixVerticalIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type SortableNote = { id: string; label: string | null; content: string };

export function SortNotesDialog({
  bundleId,
  notes,
}: {
  bundleId: string;
  notes: SortableNote[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState(notes);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(
    // Small distance so clicks on the row buttons don't start a drag
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dirty = order.some((note, index) => note.id !== notes[index]?.id);

  function handleOpenChange(next: boolean) {
    // Escape cancels a keyboard drag; don't let it also close the dialog
    if (!next && activeId) return;
    // Every open starts from the saved order; cancel just discards
    if (next) setOrder(notes);
    setOpen(next);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length || from === to) return;
    setOrder((prev) => arrayMove(prev, from, to));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setOrder((prev) =>
      arrayMove(
        prev,
        prev.findIndex((note) => note.id === active.id),
        prev.findIndex((note) => note.id === over.id),
      ),
    );
  }

  async function handleApply() {
    setSaving(true);
    try {
      const response = await fetch(`/api/bundles/${bundleId}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteIds: order.map((note) => note.id) }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "Something went wrong while saving the order.",
        );
      }

      toast.success("Order saved", "The bundle's notes were reordered.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        "Couldn't save order",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={notes.length < 2}
        onClick={() => handleOpenChange(true)}
      >
        <ArrowsDownUpIcon data-icon="inline-start" />
        Sort
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sort notes</DialogTitle>
            <DialogDescription>
              Drag notes by the handle, or use the arrows. Changes are only
              saved when you apply them.
            </DialogDescription>
          </DialogHeader>

          <div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              <SortableContext
                items={order.map((note) => note.id)}
                strategy={verticalListSortingStrategy}
              >
                <ol className="flex flex-col gap-2">
                  {order.map((note, index) => (
                    <SortableRow
                      key={note.id}
                      note={note}
                      index={index}
                      last={order.length - 1}
                      onMove={move}
                    />
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          </div>

          <DialogFooter className="sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              disabled={!dirty || saving}
              onClick={() => setOrder(notes)}
            >
              Reset
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!dirty || saving}
                onClick={handleApply}
              >
                {saving ? "Applying..." : "Apply"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SortableRow({
  note,
  index,
  last,
  onMove,
}: {
  note: SortableNote;
  index: number;
  last: number;
  onMove: (from: number, to: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const title = note.label ?? "Untitled note";

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "bg-card flex items-center gap-3 rounded-lg border px-2 py-2",
        isDragging && "ring-primary/40 relative z-10 shadow-lg ring-2",
      )}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        aria-label={`Drag to reorder ${title}`}
        className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-9 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <DotsSixVerticalIcon className="size-4" weight="bold" />
      </button>

      <span className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded text-xs font-medium tabular-nums">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {note.content}
        </p>
      </div>

      <div className="flex shrink-0 items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move to top"
          title="Move to top"
          disabled={index === 0}
          onClick={() => onMove(index, 0)}
          className="hidden sm:inline-flex"
        >
          <ArrowLineUpIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move up"
          title="Move up"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
        >
          <ArrowUpIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move down"
          title="Move down"
          disabled={index === last}
          onClick={() => onMove(index, index + 1)}
        >
          <ArrowDownIcon />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move to bottom"
          title="Move to bottom"
          disabled={index === last}
          onClick={() => onMove(index, last)}
          className="hidden sm:inline-flex"
        >
          <ArrowLineDownIcon />
        </Button>
      </div>
    </li>
  );
}
