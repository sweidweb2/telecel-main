import { ContactForm } from "@/components/marketing/contact-form";
import { SignalMotif } from "@/components/brand/signal-motif";
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
  const intentRaw = Array.isArray(params.intent) ? params.intent[0] : params.intent;
  const intent = resolveIntent(intentRaw);

  return (
    <main className="flex-1">
      <section className="container-site grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-5">
          <p className="type-notation text-brand">Contact</p>
          <h1 className="mt-5 max-w-[16ch] type-display text-balance text-ink">
            Tell us what you need
          </h1>
          <p className="mt-6 max-w-[42ch] text-lg leading-7 text-muted-foreground">
            Sales, demos, or account help — including password resets. Share a
            few details and the right Telecel Global contact will follow up.
          </p>
          <SignalMotif className="mt-10 hidden max-w-xs text-brand/40 lg:block" />
        </div>
        <div className="lg:col-span-7">
          <ContactForm defaultIntent={intent} />
        </div>
      </section>
    </main>
  );
}
