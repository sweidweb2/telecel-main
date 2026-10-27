import { Skeleton } from "@/components/ui/skeleton";

/** Shadcn fallback for `/dashboard/users` until boneyard bones are captured. */
export function UsersPageSkeleton() {
  return (
    <main className="dashboard-page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-11 w-full sm:h-8 sm:w-32" />
      </div>

      <div className="flex w-full flex-row gap-2 sm:gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className="h-[4.25rem] min-w-0 flex-1 rounded-xl"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
          <Skeleton className="h-11 min-w-0 flex-1 sm:h-8" />
          <Skeleton className="h-11 w-full sm:h-8 sm:w-36" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 px-4 py-3">
              {Array.from({ length: 6 }, (_, cell) => (
                <Skeleton key={cell} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </main>
  );
}
