import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";

import { ErrorScreen } from "@/components/layout/error-screen";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE_CTAS } from "@/constants/site-nav";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Static 404 — no session lookup, so it stays cheap and cacheable. */
export default function NotFound() {
  return (
    <>
      <SiteNavbar />
      <div className="flex flex-1 flex-col">
        <ErrorScreen
          icon={FileQuestionIcon}
          code="404"
          title="Page not found"
          description="This page does not exist or has moved. Check the URL, or continue from the home page."
        >
          <Link href={ROUTES.home} className={buttonVariants({ size: "cta" })}>
            Go to home page
          </Link>
          <Link
            href={SITE_CTAS.talkToSales.href}
            className={buttonVariants({ size: "cta", variant: "ink-outline" })}
          >
            {SITE_CTAS.talkToSales.label}
          </Link>
        </ErrorScreen>
      </div>
      <SiteFooter />
    </>
  );
}
