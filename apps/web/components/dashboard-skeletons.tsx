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

const cardClassName = "bg-card ring-foreground/10 rounded-xl ring-1";
const listClassName = "bg-card divide-y overflow-hidden rounded-xl border";

function repeat(count: number, render: (index: number) => React.ReactNode) {
  return Array.from({ length: count }, (_, index) => render(index));
}

/**
 * Stands in for the heading row the dashboard views share: a title and
 * subtitle on the left, the view's controls on the right.
 */
export function ViewHeaderSkeleton({
  title,
  icon = false,
  viewToggle = true,
  actions = 1,
}: {
  // Titles known ahead of the data are shown for real
  title?: string;
  icon?: boolean;
  viewToggle?: boolean;
  actions?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {icon && <Bar className="size-9 shrink-0 rounded-lg" />}
        <div>
          {title ? (
            <h2 className="text-lg font-semibold">{title}</h2>
          ) : (
            <Bar className="my-1 h-5 w-40" />
          )}
          <Bar className="my-0.75 h-3.5 w-48" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        {viewToggle && <Bar className="h-8 w-15 rounded-lg" />}
        {repeat(actions, (index) => (
          <Bar key={index} className="h-9 w-28 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function BackLinkSkeleton() {
  return <Bar className="h-5 w-20" />;
}

export function ToolbarSkeleton({ filters = false }: { filters?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Bar className="h-9 flex-1 rounded-lg" />
        <Bar className="h-9 w-28 rounded-lg" />
      </div>
      {filters && (
        <div className="flex flex-wrap items-center gap-2">
          {repeat(4, (index) => (
            <Bar key={index} className="h-8 w-24 rounded-lg" />
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

export function NoteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={NOTE_GRID_CLASS_NAME}>
      {repeat(count, (index) => (
        <div
          key={index}
          className="bg-card border-edge raised flex flex-col overflow-hidden rounded-xl border"
        >
          <div className="pt-3 pr-2.5 pl-4">
            <Bar className="my-0.5 h-5 w-24 rounded-[7px]" />
          </div>
          <div className="flex flex-col gap-2 px-4 pt-2.5 pb-3.5">
            <Bar className="my-0.5 h-5 w-2/3" />
            <div className="flex flex-col gap-2">
              <Bar className="h-3.5 w-full" />
              <Bar className="h-3.5 w-full" />
              <Bar className="h-3.5 w-3/5" />
            </div>
            <Bar className="mt-1 h-5.5 w-16 rounded-[7px]" />
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 border-t px-4 py-3">
            <Bar className="h-3.5 w-28" />
            <Bar className="h-3.5 w-14" />
          </div>
        </div>
      ))}
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
      {repeat(count, (index) => (
        <div
          key={index}
          className="flex items-center gap-3.5 border border-transparent py-2.5 pr-2.5 pl-3"
        >
          {numbered && <Bar className="h-3.5 w-4 shrink-0" />}
          <Bar className="size-9 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Bar className="my-0.5 h-4 w-1/3" />
            <Bar className="my-0.5 h-3.5 w-2/3" />
          </div>
          <Bar className="hidden h-6 w-28 shrink-0 rounded-[7px] md:block" />
          <Bar className="h-3.5 w-14 shrink-0" />
        </div>
      ))}
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
        <div
          key={index}
          className="bg-card border-edge raised overflow-hidden rounded-xl border"
        >
          <Bar className="aspect-16/10 w-full rounded-none" />
          <div className="flex items-center gap-3 py-3 pr-2.5 pl-3.5">
            <Bar className="size-9 shrink-0 rounded-lg" />
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <Bar className="my-0.75 h-4 w-2/3" />
              <Bar className="my-0.5 h-3 w-1/3" />
            </div>
          </div>
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
        <div
          key={index}
          className="bg-card border-edge raised overflow-hidden rounded-xl border"
        >
          <Bar className="aspect-16/10 w-full rounded-none" />
          <div className="flex flex-col gap-2 pt-3 pr-2.5 pb-3.5 pl-3.5">
            <Bar className="my-1 h-4 w-2/3" />
            <div className="flex items-center justify-between gap-2">
              <Bar className="h-3 w-14" />
              <Bar className="h-5.5 w-28 rounded-[7px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PickerRowsSkeleton({ count }: { count: number }) {
  return (
    <div className="divide-y">
      {repeat(count, (index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3">
          <Bar className="mt-0.5 size-4 shrink-0 rounded-sm" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Bar className="my-0.5 h-4 w-1/2" />
            <Bar className="my-0.5 h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The new and edit bundle pages: a name field over the picker and the order. */
export function BundleFormSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <BackLinkSkeleton />
      <ViewHeaderSkeleton title={title} viewToggle={false} actions={2} />
      <div className="flex max-w-md flex-col gap-1.5">
        <Bar className="h-4 w-12" />
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
          </div>
          <PickerRowsSkeleton count={3} />
        </section>
      </div>
    </div>
  );
}
