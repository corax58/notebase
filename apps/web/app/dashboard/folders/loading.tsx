import {
  FolderGridSkeleton,
  LoadingStatus,
  ToolbarSkeleton,
  ViewHeaderSkeleton,
} from "@/components/dashboard-skeletons";

export default function FoldersLoading() {
  return (
    <div className="bg-secondary h-full rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading folders" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <ViewHeaderSkeleton title="Folders" />
          <ToolbarSkeleton />
        </div>
        <FolderGridSkeleton />
      </div>
    </div>
  );
}
