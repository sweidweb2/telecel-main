import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import type { PortalSection } from "@/constants/dashboard-nav";

/** Empty portal section: heading plus the capabilities planned for it. */
export function PortalPlaceholder({ section }: { section: PortalSection }) {
  return (
    <main className="dashboard-page gap-8">
      <PortalPageHeader title={section.title} description={section.description} />
      <section aria-labelledby="planned-heading" className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span aria-hidden className="size-2 rounded-full bg-brand" />
          <h3 id="planned-heading" className="type-notation text-muted-foreground">
            Planned for Phase 1 · not built yet
          </h3>
        </div>
        {section.planned.length > 0 ? (
          <ol className="mt-4 border-t">
            {section.planned.map((item, index) => (
              <li key={item} className="grid grid-cols-[2.5rem_1fr] items-baseline border-b py-4">
                <span className="type-notation text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </main>
  );
}
