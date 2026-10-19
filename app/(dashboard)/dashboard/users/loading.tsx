import { RouteSkeleton } from "@/components/skeleton/route-skeleton";
import { UsersPageSkeleton } from "@/components/users/users-page-skeleton";

export default function UsersLoading() {
  return (
    <RouteSkeleton
      name="dashboard-users"
      fallback={<UsersPageSkeleton />}
    />
  );
}
