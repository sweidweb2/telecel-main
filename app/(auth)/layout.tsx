import type { ReactNode } from "react";
import type { Metadata } from "next";

import { enFooterLabels, frFooterLabels } from "@/components/layout/site-footer-labels";
import { SiteFooter } from "@/components/layout/site-footer";
import { navLabelsFor } from "@/components/layout/site-nav-labels";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { isAuthenticated } from "@/data/auth";
import { getRequestLocale } from "@/lib/i18n/request-locale";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, loggedIn] = await Promise.all([
    getRequestLocale(),
    isAuthenticated(),
  ]);
  const footerLabels = locale === "fr" ? frFooterLabels() : enFooterLabels();

  return (
    <>
      <SiteNavbar
        locale={locale}
        labels={navLabelsFor(locale)}
        isAuthenticated={loggedIn}
      />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter labels={footerLabels} />
    </>
  );
}
