"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SiteNavSection } from "@/constants/site-nav";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SiteNavDesktopProps = {
  items: readonly SiteNavSection[];
};

/** Desktop primary links — client only for active pathname. */
export function SiteNavDesktop({ items }: SiteNavDesktopProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden flex-1 items-center justify-center gap-7 min-[75rem]:flex"
    >
      {items.map((item) => {
        const active = isNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative py-2 text-[15px] font-medium text-ink/80 transition-colors duration-150 hover:text-ink",
              "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-150",
              "hover:after:scale-x-100",
              active && "text-ink after:scale-x-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
