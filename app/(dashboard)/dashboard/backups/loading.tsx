import { DashboardPageSkeleton } from "@/components/dashboard/page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function Loading() {
  return (
    <RouteSkeleton
      name="dashboard-backups"
      fallback={<DashboardPageSkeleton />}
    />
  );
}
