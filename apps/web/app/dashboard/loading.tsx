import { LoadingStatus } from "@/components/dashboard-skeletons";
import {
  CountedRowsSkeleton,
  CountSkeleton,
  OverviewShell,
  RecentNotesSkeleton,
} from "./_components/overview-shell";

export default function DashboardLoading() {
  return (
    <>
      <LoadingStatus label="Loading your dashboard" />
      <OverviewShell
        noteCount={<CountSkeleton />}
        folderCount={<CountSkeleton />}
        tagCount={<CountSkeleton />}
        recentNotes={<RecentNotesSkeleton />}
        folders={<CountedRowsSkeleton />}
        tags={<CountedRowsSkeleton />}
      />
    </>
  );
}
