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
      <SiteNavbar />
      <PageContainer as="div">{children}</PageContainer>
      <SiteFooter />
    </>
  );
}
