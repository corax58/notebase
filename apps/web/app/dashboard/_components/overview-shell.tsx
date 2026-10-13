import { Bar } from "@/components/dashboard-skeletons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightIcon,
  FolderIcon,
  NotePencilIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

type OverviewShellProps = {
  noteCount: React.ReactNode;
  folderCount: React.ReactNode;
  tagCount: React.ReactNode;
  recentNotes: React.ReactNode;
  folders: React.ReactNode;
  tags: React.ReactNode;
};

/**
 * Everything on the overview that doesn't wait on data. The page fills the
 * slots with sections that stream in, the loading state with their skeletons.
 */
export function OverviewShell({
  noteCount,
  folderCount,
  tagCount,
  recentNotes,
  folders,
  tags,
}: OverviewShellProps) {
  const stats = [
    {
      label: "Notes",
      value: noteCount,
      icon: NotePencilIcon,
      href: "/dashboard/notes",
    },
    {
      label: "Folders",
      value: folderCount,
      icon: FolderIcon,
      href: "/dashboard/folders",
    },
    {
      label: "Tags",
      value: tagCount,
      icon: TagIcon,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const card = (
            <Card
              size="sm"
              className={
                stat.href
                  ? "hover:bg-muted/50 rounded-lg transition-colors"
                  : "rounded-lg"
              }
            >
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <div className="text-2xl font-semibold">{stat.value}</div>
                </div>
                <div className="bg-primary/10 text-primary border-primary flex size-10 items-center justify-center rounded-lg border">
                  <stat.icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Recent notes</CardTitle>
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
          <CardContent className="flex flex-col gap-1">
            {recentNotes}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Folders</CardTitle>
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
            <CardContent className="flex flex-col gap-1">{folders}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">{tags}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function CountSkeleton() {
  return <Bar className="my-1 h-6 w-10" />;
}

export function RecentNotesSkeleton({ count = 5 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="flex flex-col px-3 py-2.5">
      <Bar className="my-0.75 h-3.5 w-1/2" />
      <Bar className="my-0.5 h-3 w-1/3" />
    </div>
  ));
}

// Folders and tags share a row: an icon and a name, with a count at the end
export function CountedRowsSkeleton({ count = 5 }: { count?: number }) {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="flex items-center justify-between gap-2 px-3 py-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Bar className="size-4 shrink-0" />
        <Bar className="my-0.75 h-3.5 w-1/2" />
      </div>
      <Bar className="h-3 w-4 shrink-0" />
    </div>
  ));
}
