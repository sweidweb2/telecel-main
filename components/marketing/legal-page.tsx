import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import type { LegalDocument } from "@/constants/legal-content";
import { ROUTES } from "@/constants/routes";

function formatUpdated(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Long-form legal document: title, last-updated date, contents, sections. */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <main>
      <header className="border-b bg-surface">
        <Container className="py-12 sm:py-14 lg:py-20">
          <Text variant="brand">Legal</Text>
          <Heading level="display" as="h1" className="mt-4 max-w-[22ch]">
            {doc.title}
          </Heading>
          <Text variant="lead" className="mt-5 max-w-[56ch]">
            {doc.summary}
          </Text>
          <Text variant="muted" className="mt-4">
            Last updated{" "}
            <time dateTime={doc.updated}>{formatUpdated(doc.updated)}</time>
          </Text>
        </Container>
      </header>

      <Container className="grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <nav aria-label="On this page" className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <Text variant="notation">On this page</Text>
            <ol className="mt-3 grid gap-1 text-sm">
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex min-h-9 items-center text-muted-foreground hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 max-w-[68ch] lg:col-span-9">
          {doc.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-b border-hairline py-8 first:pt-0 last:border-b-0"
            >
              <Heading level="subtitle" as="h2">
                {section.title}
              </Heading>
              {section.paragraphs.map((paragraph, i) => (
                <Text key={`${section.id}-p${i}`} className="mt-4">
                  {paragraph}
                </Text>
              ))}
              {section.bullets ? (
                <ul className="mt-4 grid list-disc gap-2 pl-5">
                  {section.bullets.map((bullet, i) => (
                    <li
                      key={`${section.id}-b${i}`}
                      className="text-base leading-7 text-foreground"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.id === "contact" ? (
                <Link
                  href={ROUTES.contact}
                  className="mt-4 inline-flex min-h-11 items-center font-medium text-brand underline-offset-4 hover:underline"
                >
                  Go to the contact page
                </Link>
              ) : null}
            </section>
          ))}
        </article>
      </Container>
    </main>
  );
}
