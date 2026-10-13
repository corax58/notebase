import {
  BundleGridSkeleton,
  LoadingStatus,
  ViewHeaderSkeleton,
} from "@/components/dashboard-skeletons";

export default function BundlesLoading() {
  return (
    <div className="bg-secondary h-full rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading bundles" />
      <div className="flex flex-col gap-6">
        <ViewHeaderSkeleton title="Bundles" />
        <BundleGridSkeleton />
      </div>
    </div>
  );
}
