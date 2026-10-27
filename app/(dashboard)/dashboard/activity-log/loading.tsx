import { DashboardPageSkeleton } from "@/components/dashboard/page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function ActivityLogLoading() {
  return (
    <RouteSkeleton
      name="dashboard-activity-log"
      fallback={<DashboardPageSkeleton />}
    />
  );
}
