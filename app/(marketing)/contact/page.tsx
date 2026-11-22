import { SignalMotif } from "@/components/brand/signal-motif";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/marketing/contact-form";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { INQUIRY_INTENTS } from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import { buildMarketingMetadata } from "@/lib/seo/marketing-metadata";
import type { InquiryIntent } from "@/types/inquiry";

export const metadata = buildMarketingMetadata({
  path: ROUTES.contact,
  title: "Contact",
  description:
    "Talk to Telecel Global about sales, demos, or account help. We route every inquiry to the right team.",
});

function resolveIntent(raw: string | undefined): InquiryIntent {
  if (raw && INQUIRY_INTENTS.some((item) => item.value === raw)) {
    return raw as InquiryIntent;
  }
  return "sales";
}

export default async function ContactPage({
  searchParams,
}: PageProps<"/contact">) {
  const params = await searchParams;
  const intentRaw = Array.isArray(params.intent)
    ? params.intent[0]
    : params.intent;
  const intent = resolveIntent(intentRaw);

  return (
    <main>
      <section className="border-b">
        <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-5">
            <Text variant="brand">Contact</Text>
            <Heading level="display" as="h1" className="mt-5 max-w-[16ch]">
              Tell us what you need
            </Heading>
            <Text variant="lead" className="mt-6 max-w-[42ch]">
              Sales, demos, or account help — including password resets. Share a
              few details and the right Telecel Global contact will follow up.
            </Text>
            <SignalMotif className="mt-10 hidden max-w-xs text-brand/40 lg:block" />
          </div>
          <div className="lg:col-span-7">
            <ContactForm key={intent} defaultIntent={intent} />
          </div>
        </Container>
      </section>
    </main>
  );
}
