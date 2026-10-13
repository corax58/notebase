import {
  BackLinkSkeleton,
  LoadingStatus,
  NoteGridSkeleton,
  ViewHeaderSkeleton,
} from "@/components/dashboard-skeletons";

export default function FolderLoading() {
  return (
    <div className="bg-secondary flex flex-col gap-6 rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading folder" />
      <BackLinkSkeleton />
      <ViewHeaderSkeleton icon />
      <NoteGridSkeleton />
    </div>
  );
}
