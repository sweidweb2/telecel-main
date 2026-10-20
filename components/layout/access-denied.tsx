import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * 403 screen rendered by pages the caller's role cannot open (stable
 * alternative to the experimental `forbidden()` API).
 */
export function AccessDenied({
  description = "This section is limited to administrators. Ask an admin if you need access.",
}: {
  description?: string;
}) {
  return (
    <ErrorScreen
      icon={ShieldAlertIcon}
      code="403"
      title="Access denied"
      description={description}
    >
      <Link href={ROUTES.dashboard} className={buttonVariants({ size: "cta" })}>
        Back to dashboard
      </Link>
    </ErrorScreen>
  );
}
