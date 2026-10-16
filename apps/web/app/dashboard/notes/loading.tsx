import {
  Bar,
  LoadingStatus,
  NoteGridSkeleton,
  NoteRowsSkeleton,
  ToolbarSkeleton,
  ViewToggleSkeleton,
} from "@/components/dashboard-skeletons";
import { ViewModeSkeleton } from "@/components/view-toggle";

export default function NotesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingStatus label="Loading notes" />
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[28px] leading-[1.1] font-bold tracking-[-0.035em]">
              Notes
            </h2>
            <Bar className="h-3.5 w-40" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ViewToggleSkeleton />
            <Bar className="h-9 w-25.5 rounded-lg" />
          </div>
        </div>
        <ToolbarSkeleton sortClassName="sm:w-37.5" filters />
      </div>
      <ViewModeSkeleton
        storageKey="notes-view"
        grid={<NoteGridSkeleton />}
        list={<NoteRowsSkeleton />}
      />
    </div>
  );
}
