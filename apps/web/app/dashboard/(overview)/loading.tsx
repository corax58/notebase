import { LoadingStatus } from "@/components/dashboard-skeletons";
import {
  CountSkeleton,
  FolderBreakdownSkeleton,
  FolderRowsSkeleton,
  OverviewShell,
  RecentNotesSkeleton,
  TagChipsSkeleton,
} from "./_components/overview-shell";

export default function DashboardLoading() {
  return (
    <>
      <LoadingStatus label="Loading your dashboard" />
      <OverviewShell
        noteCount={<CountSkeleton />}
        folderCount={<CountSkeleton />}
        folderBreakdown={<FolderBreakdownSkeleton />}
        tagCount={<CountSkeleton />}
        recentNotes={<RecentNotesSkeleton />}
        folders={<FolderRowsSkeleton />}
        tags={<TagChipsSkeleton />}
      />
    </>
  );
}
