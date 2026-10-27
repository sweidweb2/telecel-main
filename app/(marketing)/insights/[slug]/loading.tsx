import { InsightDetailSkeleton } from "@/components/marketing/insight-detail-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function InsightDetailLoading() {
  return (
    <RouteSkeleton
      name="marketing-insight-detail"
      fallback={<InsightDetailSkeleton />}
      select="container"
    />
  );
}
