import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function InsightsFallback() {
  return (
    <main className="flex-1">
      <header className="border-b bg-surface">
        <div className="container-site space-y-4 py-12 sm:py-14 lg:py-20">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-1/2 max-w-md" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
      </header>
      <section className="container-site grid gap-6 py-10 lg:grid-cols-12 lg:py-16">
        <div className="space-y-3 lg:col-span-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-2/3" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </section>
    </main>
  );
}

export default function InsightsLoading() {
  return (
    <RouteSkeleton name="marketing-insights" fallback={<InsightsFallback />} />
  );
}
