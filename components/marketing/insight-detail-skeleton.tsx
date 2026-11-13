import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export function InsightDetailSkeleton() {
  return (
    <main>
      <article className="pb-16 lg:pb-24">
        <Container className="pt-8 sm:pt-10 lg:pt-12">
          <Skeleton className="h-11 w-40" />
          <div className="mt-6 max-w-3xl space-y-4 sm:mt-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full sm:h-12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </Container>

        <Container className="mt-8 sm:mt-10">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl md:aspect-[2/1]" />
        </Container>

        <Container className="mt-8 space-y-4 border-b pb-8 sm:mt-10 lg:pb-10">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-40" />
        </Container>

        <Container className="mt-8 sm:mt-10">
          <div className="mx-auto max-w-3xl space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </Container>
      </article>
    </main>
  );
}
