import {
  BackLinkSkeleton,
  Bar,
  LoadingStatus,
  NoteRowsSkeleton,
} from "@/components/dashboard-skeletons";

export default function BundleLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingStatus label="Loading bundle" />
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 md:px-6 md:py-5">
        <BackLinkSkeleton href="/dashboard/bundles" label="Bundles" />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
          <div className="order-1 flex min-w-0 flex-1 items-center gap-3">
            <Bar className="size-10 shrink-0 rounded-lg" />
            <div className="min-w-0">
              <Bar className="my-0.75 h-6 w-48" />
              <Bar className="my-0.75 h-3.5 w-40" />
            </div>
          </div>
          {/* Sort and Compile */}
          <div className="order-3 flex w-full flex-wrap items-center gap-3 lg:order-2 lg:w-auto">
            <Bar className="h-9 w-18 rounded-lg" />
            <Bar className="h-9 w-25 rounded-lg" />
          </div>
          {/* The options menu's ghost button */}
          <span aria-hidden className="order-2 size-9 shrink-0 lg:order-3" />
        </div>
      </div>
      <NoteRowsSkeleton numbered />
    </div>
  );
}
