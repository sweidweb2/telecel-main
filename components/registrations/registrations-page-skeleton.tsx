import { Skeleton } from "@/components/ui/skeleton";

/** Shadcn fallback for `/dashboard/registrations` until boneyard bones are captured. */
export function RegistrationsPageSkeleton() {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center">
          <Skeleton className="h-11 min-w-0 flex-1 sm:h-8" />
        </div>
        <div className="divide-y">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="grid grid-cols-7 gap-2 px-4 py-3">
              {Array.from({ length: 7 }, (_, cell) => (
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
