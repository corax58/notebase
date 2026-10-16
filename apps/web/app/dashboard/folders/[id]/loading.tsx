import {
  BackLinkSkeleton,
  Bar,
  LoadingStatus,
  NoteGridSkeleton,
  NoteRowsSkeleton,
  ViewToggleSkeleton,
} from "@/components/dashboard-skeletons";
import { ViewModeSkeleton } from "@/components/view-toggle";

export default function FolderLoading() {
  return (
    <div className="bg-secondary flex flex-col gap-6 rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading folder" />
      <BackLinkSkeleton href="/dashboard/folders" label="Folders" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Bar className="size-9 shrink-0 rounded-lg" />
          <div>
            <Bar className="my-1 h-5 w-40" />
            <Bar className="my-0.75 h-3.5 w-16" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ViewToggleSkeleton />
          <Bar className="h-9 w-25.5 rounded-lg" />
        </div>
      </div>
      <ViewModeSkeleton
        storageKey="notes-view"
        grid={<NoteGridSkeleton />}
        list={<NoteRowsSkeleton />}
      />
    </div>
  );
}
