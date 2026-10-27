import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function MarketingHomeFallback() {
  return (
    <main className="container-site flex-1 py-10 sm:py-14 lg:py-16">
      <div className="grid max-w-2xl gap-4">
        <Skeleton className="h-9 w-2/3 sm:h-10" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-11 w-full sm:h-9 sm:w-32" />
      </div>
    </main>
  );
}

export default function Loading() {
  return (
    <RouteSkeleton name="marketing-home" fallback={<MarketingHomeFallback />} />
  );
}
