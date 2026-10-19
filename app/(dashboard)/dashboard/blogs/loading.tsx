import { BlogsPageSkeleton } from "@/components/blogs/blogs-page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function BlogsLoading() {
  return (
    <RouteSkeleton name="dashboard-blogs" fallback={<BlogsPageSkeleton />} />
  );
}
