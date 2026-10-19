import { PageHero, Section } from "@/components/marketing/page-elements";
import type { LegalPageCopy } from "@/types/marketing-page";

type LegalPageContentProps = {
  copy: LegalPageCopy;
};

export function LegalPageContent({ copy }: LegalPageContentProps) {
  return (
    <main>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Section className="max-w-3xl">
        <p className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {copy.notice}
        </p>
        <p className="mt-6 text-sm text-muted-foreground">{copy.lastUpdated}</p>
        <div className="mt-10 space-y-10">
          {copy.sections.map((section) => (
            <article key={section.title} className="space-y-4">
              <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="leading-7 text-muted-foreground text-pretty"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
