import type { ReactNode } from "react";

import { enFooterLabels } from "@/components/layout/site-footer-labels";
import { SiteFooter } from "@/components/layout/site-footer";
import { enNavLabels } from "@/components/layout/site-nav-labels";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { isAuthenticated } from "@/data/auth";

export default async function EnMarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const loggedIn = await isAuthenticated();

  return (
    <>
      <SiteNavbar
        locale="en"
        labels={enNavLabels()}
        isAuthenticated={loggedIn}
      />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter labels={enFooterLabels()} />
    </>
  );
}
