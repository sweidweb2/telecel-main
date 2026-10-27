import { InsightsPageSkeleton } from "@/components/marketing/insights-page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function InsightsLoading() {
  return (
    <RouteSkeleton
      name="marketing-insights"
      fallback={<InsightsPageSkeleton />}
      select="container"
    />
  );
}
