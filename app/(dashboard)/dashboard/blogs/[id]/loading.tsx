import { BlogsPageSkeleton } from "@/components/blogs/blogs-page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function EditBlogLoading() {
  return (
    <RouteSkeleton
      name="dashboard-blogs-edit"
      fallback={<BlogsPageSkeleton />}
    />
  );
}
