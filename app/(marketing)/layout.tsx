import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

/**
 * Public pages stay static/cacheable: nothing here reads cookies or the
 * session (staff reach the CMS at /login or /dashboard directly).
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-background px-4 py-2 font-medium shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteNavbar />
      <div id="main-content" tabIndex={-1} className="outline-none">
        <PageContainer as="div">{children}</PageContainer>
      </div>
      <SiteFooter />
    </>
  );
}
