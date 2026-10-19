import { ContactMessagesPageSkeleton } from "@/components/contact-messages/contact-messages-page-skeleton";
import { RouteSkeleton } from "@/components/skeleton/route-skeleton";

export default function ContactUsLoading() {
  return (
    <RouteSkeleton
      name="dashboard-contact-us"
      fallback={<ContactMessagesPageSkeleton />}
    />
  );
}
