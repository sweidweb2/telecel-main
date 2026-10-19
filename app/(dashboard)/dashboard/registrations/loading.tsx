import { RegistrationsPageSkeleton } from "@/components/registrations/registrations-page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function RegistrationsLoading() {
  return (
    <RouteSkeleton
      name="dashboard-registrations"
      fallback={<RegistrationsPageSkeleton />}
    />
  );
}
