import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function ContactFallback() {
  return (
    <main className="flex-1">
      <section className="container-site grid gap-12 py-14 lg:grid-cols-12 lg:py-24">
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-20 w-full max-w-md" />
        </div>
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </section>
    </main>
  );
}

export default function ContactLoading() {
  return (
    <RouteSkeleton
      name="marketing-contact"
      fallback={<ContactFallback />}
      select="container"
    />
  );
}
