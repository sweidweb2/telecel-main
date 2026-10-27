import { Skeleton } from "@/components/ui/skeleton";

export function InsightsPageSkeleton() {
  return (
    <main>
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="container-site">
          <div className="flex w-full max-w-3xl flex-col gap-3 sm:gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4 sm:h-12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      </section>

      <div className="container-site flex flex-col gap-12 pb-16 md:gap-16 lg:pb-24">
        <Skeleton className="hidden aspect-[2/1] w-full rounded-2xl md:block md:h-[28rem] lg:h-[36rem]" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-24 shrink-0" />
          ))}
        </div>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="flex flex-col gap-5">
              <Skeleton className="aspect-[1.5] w-full rounded-2xl" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
