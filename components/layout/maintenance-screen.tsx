import Link from "next/link";
import { ConstructionIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function MaintenanceScreen({
  variant = "full",
  description,
}: {
  /** `full` = Level 2 public outage; `login` = Level 1 auth-only block. */
  variant?: "full" | "login";
  description?: string;
}) {
  const copy =
    description ??
    (variant === "login"
      ? "Sign-in is temporarily unavailable while we perform maintenance. The public site remains available."
      : "Telecel Global is temporarily unavailable while we perform scheduled maintenance. Please check back shortly.");

  return (
    <ErrorScreen
      icon={ConstructionIcon}
      code="503"
      title="We'll be right back"
      description={copy}
    >
      {variant === "login" ? (
        <Link href={ROUTES.home} className={buttonVariants({ size: "cta" })}>
          Go to home page
        </Link>
      ) : null}
    </ErrorScreen>
  );
}
