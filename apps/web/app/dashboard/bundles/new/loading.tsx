import {
  BundleFormSkeleton,
  LoadingStatus,
} from "@/components/dashboard-skeletons";

export default function NewBundleLoading() {
  return (
    <div className="bg-secondary flex flex-col gap-6 rounded-xl border p-4 md:p-6">
      <LoadingStatus label="Loading your notes" />
      <BundleFormSkeleton title="New Bundle" />
    </div>
  );
}
