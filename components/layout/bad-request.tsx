import Link from "next/link";
import { BanIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

/**
 * 400 screen for intentional page-level bad requests (malformed params,
 * unsupported query combinations). Prefer returning action/API error
 * results for form and mutation failures instead.
 */
export function BadRequest({
  description = "The request could not be understood. Check the URL or try again from the home page.",
  homeHref = ROUTES.home,
  homeLabel = "Go to home page",
}: {
  description?: string;
  homeHref?: string;
  homeLabel?: string;
}) {
  return (
    <ErrorScreen
      icon={BanIcon}
      code="400"
      title="Bad request"
      description={description}
    >
      <Link href={homeHref} className={buttonVariants({ size: "cta" })}>
        {homeLabel}
      </Link>
    </ErrorScreen>
  );
}
