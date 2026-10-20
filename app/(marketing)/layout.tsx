import type { ReactNode } from "react";

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
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
