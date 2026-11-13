import type { ReactNode } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PageContainer as="div">{children}</PageContainer>;
}
