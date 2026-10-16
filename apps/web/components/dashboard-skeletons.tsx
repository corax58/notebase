import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Tinted from the foreground so a bar reads on the page, on a card and on the
// secondary panels alike, in both themes — `bg-muted` matches some of those
export function Bar({ className }: { className?: string }) {
  return <Skeleton className={cn("bg-foreground/10", className)} />;
}

// Skeletons are decorative, so this is what a screen reader hears instead
export function LoadingStatus({ label }: { label: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}

function repeat(count: number, render: (index: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, index) => render(index));
}

// Icon-only ghost buttons, like an item's options menu, are barely there at
// rest, so the skeletons keep their space without drawing them
function GhostSlot({ className }: { className?: string }) {
  return <span aria-hidden className={cn("shrink-0", className)} />;
}

/** The link back up a level. Shown for real when its label is known. */
export function BackLinkSkeleton({
  href,
  label,
}: {
  href?: string;
  label?: string;
}) {
  if (!href || !label) return <Bar className="h-5 w-24" />;
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1 text-sm hover:underline"
    >
      <ArrowLeftIcon className="size-3.5" />
      {label}
    </Link>
  );
}

export function ViewToggleSkeleton() {
  return <Bar className="h-8.5 w-15.5 shrink-0 rounded-lg" />;
}

/**
 * The search box and sort menu, and on the notes page the filters under
 * them. The sort menu is icon-only on phones and shows its option from `sm`.
 */
export function ToolbarSkeleton({
  sortClassName,
  filters = false,
}: {
  // The sort button's width once its label shows
  sortClassName: string;
  filters?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Bar className="h-9 flex-1 rounded-lg" />
        <Bar className={cn("h-9 w-10 shrink-0 rounded-lg", sortClassName)} />
      </div>
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Folder, Tags, Created and Source */}
          {["w-22", "w-19", "w-29", "w-28"].map((width) => (
            <Bar key={width} className={cn("h-8 rounded-lg", width)} />
          ))}
        </div>
      )}
    </div>
  );
}

// The grids and list panels the dashboard views lay their items out in,
// shared with these skeletons so a loading view takes the same shape
export const NOTE_GRID_CLASS_NAME =
  "grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-4";
export const LIST_PANEL_CLASS_NAME =
  "bg-card border-edge raised flex flex-col gap-0.5 rounded-xl border p-1.5";

const cardClassName =
  "bg-card border-edge raised flex flex-col overflow-hidden rounded-xl border";
const listRowClassName =
  "flex items-center gap-3.5 rounded-lg border border-transparent py-2.5 pr-2.5 pl-3";

export function NoteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={NOTE_GRID_CLASS_NAME}>
      {repeat(count, (index) => (
        <div key={index} className={cardClassName}>
          <div className="flex items-center justify-between gap-2 pt-3 pr-2.5 pl-4">
            <Bar className="h-6 w-24 rounded-[7px]" />
            <GhostSlot className="size-7" />
          </div>
          <div className="flex flex-1 flex-col gap-2 px-4 pt-2.5 pb-3.5">
            <Bar className="my-0.5 h-4.5 w-2/3" />
            <div className="flex flex-col">
              <Bar className="my-1 h-3.5 w-full" />
              <Bar className="my-1 h-3.5 w-full" />
              <Bar className="my-1 h-3.5 w-3/5" />
            </div>
            <Bar className="mt-1 h-5.5 w-16 rounded-[7px]" />
          </div>
          <div className="bg-background/60 mt-auto flex items-center justify-between gap-2 border-t px-4 py-2.5">
            <Bar className="my-px h-3.5 w-28" />
            <Bar className="my-px h-3.5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NoteRowSkeleton() {
  return (
    <div className={listRowClassName}>
      <Bar className="size-9 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Bar className="my-0.5 h-4 w-1/3" />
        <Bar className="my-0.75 h-3.5 w-2/3" />
      </div>
      <span className="hidden w-37.5 shrink-0 md:flex">
        <Bar className="h-6 w-24 rounded-[7px]" />
      </span>
      <span className="flex w-18 shrink-0 justify-end">
        <Bar className="h-3 w-12" />
      </span>
      <GhostSlot className="size-7" />
    </div>
  );
}

export function NoteRowsSkeleton({
  count = 6,
  numbered = false,
}: {
  count?: number;
  // Bundles list their notes in order, with the position ahead of each one
  numbered?: boolean;
}) {
  return (
    <div className={LIST_PANEL_CLASS_NAME}>
      {repeat(count, (index) =>
        numbered ? (
          <div key={index} className="flex items-center">
            <span className="w-8 shrink-0 pl-3">
              <Bar className="h-3 w-2.5" />
            </span>
            <div className="min-w-0 flex-1">
              <NoteRowSkeleton />
            </div>
          </div>
        ) : (
          <NoteRowSkeleton key={index} />
        ),
      )}
    </div>
  );
}

// Shared with the folders view so the skeleton lays out the same columns
export const FOLDER_GRID_CLASS_NAME =
  "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4";

export function FolderGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={FOLDER_GRID_CLASS_NAME}>
      {repeat(count, (index) => (
        <div key={index} className={cardClassName}>
          <Bar className="aspect-16/10 w-full rounded-none border-b" />
          <div className="flex items-center gap-2 py-3 pr-2.5 pl-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Bar className="size-9 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-px">
                <Bar className="my-0.75 h-4 w-2/3" />
                <Bar className="my-0.5 h-3 w-1/3" />
              </div>
            </div>
            <GhostSlot className="size-7" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FolderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={LIST_PANEL_CLASS_NAME}>
      {repeat(count, (index) => (
        <div key={index} className={listRowClassName}>
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <Bar className="size-9 shrink-0 rounded-lg" />
            <Bar className="h-3.5 w-1/3" />
          </div>
          <Bar className="h-1.5 w-40 min-w-15 shrink rounded-[3px] max-sm:hidden" />
          <span className="flex w-18 shrink-0 justify-end">
            <Bar className="h-3 w-12" />
          </span>
          <GhostSlot className="size-7" />
        </div>
      ))}
    </div>
  );
}

export const BUNDLE_GRID_CLASS_NAME =
  "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4";

export function BundleGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={BUNDLE_GRID_CLASS_NAME}>
      {repeat(count, (index) => (
        <div key={index} className={cardClassName}>
          <Bar className="aspect-16/10 w-full rounded-none border-b" />
          <div className="flex flex-col gap-2 pt-3 pr-2.5 pb-3.5 pl-3.5">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <Bar className="h-4 w-2/3" />
              </div>
              <GhostSlot className="size-7" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <Bar className="h-3 w-14" />
              <Bar className="h-5.5 w-27 rounded-[7px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BundleListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={LIST_PANEL_CLASS_NAME}>
      {repeat(count, (index) => (
        <div key={index} className={listRowClassName}>
          <Bar className="size-9 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1">
            <Bar className="h-3.5 w-1/3" />
          </div>
          <span className="w-16 shrink-0">
            <Bar className="h-3 w-12" />
          </span>
          <span className="flex w-37.5 shrink-0 max-sm:hidden">
            <Bar className="h-5.5 w-27 rounded-[7px]" />
          </span>
          <GhostSlot className="size-7" />
        </div>
      ))}
    </div>
  );
}

// A note's title, a line of its content, and on some its folder
function NoteSummarySkeleton({ folder }: { folder: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <Bar className="my-0.5 h-4 w-1/2" />
      <Bar className="my-0.5 h-3 w-4/5" />
      {folder && <Bar className="my-0.5 h-3 w-20" />}
    </div>
  );
}

function PickerRowsSkeleton({ count }: { count: number }) {
  return (
    <div className="divide-y">
      {repeat(count, (index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3">
          <Bar className="mt-0.5 size-4 shrink-0 rounded-sm" />
          <NoteSummarySkeleton folder={index % 2 === 0} />
        </div>
      ))}
    </div>
  );
}

function OrderRowsSkeleton({ count }: { count: number }) {
  return (
    <div className="divide-y">
      {repeat(count, (index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3">
          <Bar className="mt-0.5 size-5 shrink-0 rounded-md" />
          <NoteSummarySkeleton folder={index % 2 === 0} />
          {/* Move up, move down and remove */}
          <GhostSlot className="h-6 w-18" />
        </div>
      ))}
    </div>
  );
}

/** The new and edit bundle pages: a name field over the picker and the order. */
export function BundleFormSkeleton({
  title,
  description,
  backLink,
  editing = false,
}: {
  title: string;
  description: string;
  // Where the back link goes and what it says, when known ahead of the data
  backLink?: { href: string; label: string };
  // An existing bundle comes with its notes already in order
  editing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <BackLinkSkeleton href={backLink?.href} label={backLink?.label} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Bar className="h-9 w-17.5 rounded-lg" />
          <Bar className="h-9 w-29 rounded-lg" />
        </div>
      </div>
      <div className="flex max-w-md flex-col gap-1.5">
        <span className="text-sm leading-none font-medium">Name</span>
        <Bar className="h-9 w-full rounded-lg" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="bg-card overflow-hidden rounded-xl border">
          <div className="flex flex-col gap-3 border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Your notes</h3>
              <Bar className="h-3 w-12" />
            </div>
            <Bar className="h-9 w-full rounded-lg" />
          </div>
          <PickerRowsSkeleton count={6} />
        </section>
        <section className="bg-card overflow-hidden rounded-xl border">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-sm font-semibold">In this bundle</h3>
            {editing && <Bar className="h-3 w-11" />}
          </div>
          {editing ? (
            <OrderRowsSkeleton count={3} />
          ) : (
            // A new bundle always starts empty
            <p className="text-muted-foreground px-4 py-12 text-center text-sm">
              Select notes on the left to add them here.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
