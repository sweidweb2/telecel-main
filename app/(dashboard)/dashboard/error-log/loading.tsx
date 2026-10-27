import { DashboardPageSkeleton } from "@/components/dashboard/page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function ErrorLogLoading() {
  return (
    <RouteSkeleton
      name="dashboard-error-log"
      fallback={<DashboardPageSkeleton />}
    />
  );
}
