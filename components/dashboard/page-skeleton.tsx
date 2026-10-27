import { Skeleton } from "@/components/ui/skeleton";

export function DashboardPageSkeleton() {
  return (
    <div className="dashboard-page">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
