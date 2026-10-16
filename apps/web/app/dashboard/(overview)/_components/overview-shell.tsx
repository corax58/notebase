import { Bar } from "@/components/dashboard-skeletons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  FolderIcon,
  NotePencilIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type OverviewShellProps = {
  noteCount: React.ReactNode;
  folderCount: React.ReactNode;
  folderBreakdown: React.ReactNode;
  tagCount: React.ReactNode;
  recentNotes: React.ReactNode;
  folders: React.ReactNode;
  tags: React.ReactNode;
};

// Cards sit on a solid edge, like the buttons do. The lists in them are held
// at the height of a full list (five rows, or two lines of tags), so a short
// or empty one doesn't shrink its card.
const panelClassName =
  "border-edge raised rounded-xl border ring-0 [--card-spacing:--spacing(5)]";
const statClassName =
  "flex min-h-37 flex-col justify-between gap-5 rounded-xl border p-5";
const statIconClassName =
  "flex size-8 items-center justify-center rounded-[9px] border";
const statValueClassName =
  "leading-none font-bold tracking-[-0.04em] tabular-nums";

/**
 * Everything on the overview that doesn't wait on data. The page fills the
 * slots with sections that stream in, the loading state with their skeletons.
 */
export function OverviewShell({
  noteCount,
  folderCount,
  folderBreakdown,
  tagCount,
  recentNotes,
  folders,
  tags,
}: OverviewShellProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard/notes"
          className={cn(
            statClassName,
            "bg-primary text-primary-foreground border-edge-primary pressable depth-primary flex-[1.5_1_280px] bg-[radial-gradient(oklch(1_0_0/0.16)_1px,transparent_1px)] bg-size-[22px_22px]",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(statIconClassName, "border-white/22 bg-white/16")}
              >
                <NotePencilIcon weight="fill" className="size-4" />
              </span>
              <span className="text-sm font-semibold">Notes</span>
            </div>
            <ArrowUpRightIcon weight="bold" className="size-4 opacity-85" />
          </div>
          <div className={cn(statValueClassName, "text-[52px]")}>
            {noteCount}
          </div>
        </Link>

        <Link
          href="/dashboard/folders"
          className={cn(
            statClassName,
            "bg-card border-edge pressable flex-[1_1_220px]",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  statIconClassName,
                  "bg-primary/10 text-primary border-primary/35",
                )}
              >
                <FolderIcon weight="fill" className="size-4" />
              </span>
              <span className="text-sm font-semibold">Folders</span>
            </div>
            <ArrowUpRightIcon
              weight="bold"
              className="text-muted-foreground size-4"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className={cn(statValueClassName, "text-4xl")}>
              {folderCount}
            </div>
            <div className="flex h-2 gap-0.75">{folderBreakdown}</div>
          </div>
        </Link>

        <div
          className={cn(
            statClassName,
            "bg-card border-edge raised flex-[1_1_220px]",
          )}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                statIconClassName,
                "bg-primary/10 text-primary border-primary/35",
              )}
            >
              <TagIcon weight="fill" className="size-4" />
            </span>
            <span className="text-sm font-semibold">Tags</span>
          </div>
          <div className={cn(statValueClassName, "text-4xl")}>{tagCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <Card
          className={cn(panelClassName, "min-w-0 flex-[2_1_440px] gap-3 pb-3")}
        >
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="font-semibold">Recent notes</CardTitle>
              <CardDescription>
                Your latest captures, newest first.
              </CardDescription>
            </div>
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard/notes" />}
            >
              View all
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex min-h-77.5 flex-col gap-1 px-2">
            {recentNotes}
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
          <Card className={cn(panelClassName, "gap-2 pb-3")}>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="font-semibold">Folders</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                nativeButton={false}
                render={<Link href="/dashboard/folders" />}
              >
                View all
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </CardHeader>
            <CardContent className="flex min-h-63.25 flex-col gap-0.5 px-2">
              {folders}
            </CardContent>
          </Card>

          <Card className={cn(panelClassName, "gap-3.5")}>
            <CardHeader>
              <CardTitle className="leading-8 font-semibold">Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex min-h-17 flex-wrap gap-2">
              {tags}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Sized off the number it stands in for, and tinted from the text, so the
// same bar fits the big blue card and the smaller white ones
export function CountSkeleton() {
  return <Bar className="h-[1em] w-[1.25em] rounded-lg bg-current/15" />;
}

export function FolderBreakdownSkeleton() {
  return <Bar className="h-full flex-1 rounded-[3px]" />;
}

export function RecentNotesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-3 pt-2.5 pb-1">
        <Bar className="my-0.5 h-3 w-12" />
      </div>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border border-transparent px-3 py-2"
        >
          <Bar className="size-9 shrink-0 rounded-lg" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Bar className="my-0.75 h-3.5 w-1/2" />
            <Bar className="my-0.5 h-3 w-1/3" />
          </div>
          <Bar className="h-3 w-12 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function FolderRowsSkeleton({ count = 5 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="flex flex-col gap-1.75 px-3 py-2.25">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Bar className="size-4 shrink-0" />
          <Bar className="my-0.75 h-3.5 w-1/2" />
        </div>
        <Bar className="h-3 w-4 shrink-0" />
      </div>
      <Bar className="h-1 w-full rounded-full" />
    </div>
  ));
}

export function TagChipsSkeleton({ count = 5 }: { count?: number }) {
  const widths = ["w-24", "w-28", "w-20", "w-22", "w-18"];
  return Array.from({ length: count }, (_, index) => (
    <Bar
      key={index}
      className={cn("h-7.5 rounded-[9px]", widths[index % widths.length])}
    />
  ));
}
