import {
  LoadingStatus,
  NoteGridSkeleton,
  ToolbarSkeleton,
  ViewHeaderSkeleton,
} from "@/components/dashboard-skeletons";

export default function NotesLoading() {
  return (
    <div className="bg-secondary flex flex-col gap-6 rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading notes" />
      <div className="flex flex-col gap-4">
        <ViewHeaderSkeleton title="Notes" />
        <ToolbarSkeleton filters />
      </div>
      <NoteGridSkeleton />
    </div>
  );
}
