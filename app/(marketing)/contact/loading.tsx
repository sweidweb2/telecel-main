import { Container } from "@/components/layout/container";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function ContactFallback() {
  return (
    <main className="flex-1">
      <header className="border-b bg-surface">
        <Container className="space-y-4 py-12 sm:py-14 lg:py-20">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-3/4 max-w-xl" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </Container>
      </header>
      <Container className="grid gap-6 py-10 lg:grid-cols-12 lg:py-16">
        <div className="space-y-3 lg:col-span-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="space-y-4 lg:col-span-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </Container>
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
