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
        <BackLinkSkeleton />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
          <div className="order-1 flex min-w-0 flex-1 items-center gap-3">
            <Bar className="size-10 shrink-0 rounded-lg" />
            <div className="flex flex-col gap-1">
              <Bar className="my-1 h-6 w-48" />
              <Bar className="my-0.5 h-3.5 w-40" />
            </div>
          </div>
          <div className="order-3 flex w-full items-center gap-3 lg:order-2 lg:w-auto">
            <Bar className="h-9 w-24 rounded-lg" />
            <Bar className="h-9 w-28 rounded-lg" />
          </div>
          <Bar className="order-2 size-9 shrink-0 rounded-lg lg:order-3" />
        </div>
      </div>
      <NoteRowsSkeleton numbered />
    </div>
  );
}
