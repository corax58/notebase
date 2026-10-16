import {
  Bar,
  BundleGridSkeleton,
  BundleListSkeleton,
  LoadingStatus,
  ViewToggleSkeleton,
} from "@/components/dashboard-skeletons";
import { ViewModeSkeleton } from "@/components/view-toggle";

export default function BundlesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingStatus label="Loading bundles" />
      <div className="bg-card flex flex-wrap items-end justify-between gap-4 rounded-xl border p-4 md:px-6 md:py-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[28px] leading-[1.1] font-bold tracking-[-0.035em]">
            Bundles
          </h2>
          <Bar className="h-3.5 w-56" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ViewToggleSkeleton />
          <Bar className="h-9 w-30.5 rounded-lg" />
        </div>
      </div>
      <ViewModeSkeleton
        storageKey="bundles-view"
        grid={<BundleGridSkeleton />}
        list={<BundleListSkeleton />}
      />
    </div>
  );
}
