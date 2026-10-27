import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

import { PortalPageHeader } from "@/components/dashboard/portal-page-header";
import { InquiryStatusForm } from "@/components/inquiries/inquiry-status-form";
import { AccessDenied } from "@/components/layout/access-denied";
import { buttonVariants } from "@/components/ui/button";
import {
  AREA_OF_INTEREST_OPTIONS,
  CONTACT_METHODS,
  COUNTRY_OPTIONS,
  INQUIRY_INTENTS,
} from "@/constants/inquiries";
import { ROUTES } from "@/constants/routes";
import { requireSection } from "@/data/auth";
import { getInquiryById } from "@/data/inquiries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inquiry",
};

function labelFor(
  options: readonly { value: string; label: string }[],
  value: string
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-border/60 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

export default async function InquiryDetailPage({
  params,
}: PageProps<"/dashboard/inquiries/[id]">) {
  const { id } = await params;
  const { session, allowed } = await requireSection(ROUTES.inquiries);
  if (!allowed) return <AccessDenied />;

  const inquiry = await getInquiryById(session, id);
  if (!inquiry) notFound();

  return (
    <main className="dashboard-page">
      <PortalPageHeader
        title={inquiry.full_name}
        description={`${inquiry.company} · ${inquiry.email}`}
        actions={
          <Link
            href={ROUTES.inquiries}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-11"
            )}
          >
            <ArrowLeftIcon />
            Back to list
          </Link>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section className="min-w-0 rounded-xl border bg-card px-4 sm:px-6">
          <dl>
            <DetailItem
              label="Intent"
              value={labelFor(INQUIRY_INTENTS, inquiry.intent)}
            />
            <DetailItem label="Role" value={inquiry.job_role} />
            <DetailItem
              label="Country"
              value={labelFor(COUNTRY_OPTIONS, inquiry.country_code)}
            />
            <DetailItem
              label="Area of interest"
              value={labelFor(
                AREA_OF_INTEREST_OPTIONS,
                inquiry.area_of_interest
              )}
            />
            <DetailItem
              label="Preferred contact"
              value={labelFor(
                CONTACT_METHODS,
                inquiry.preferred_contact_method
              )}
            />
            <DetailItem
              label="Received"
              value={format(
                new Date(inquiry.created_at),
                "MMM d, yyyy HH:mm"
              )}
            />
            {inquiry.source_path ? (
              <DetailItem label="Source" value={inquiry.source_path} />
            ) : null}
            <div className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-sm text-muted-foreground">Business need</dt>
              <dd className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                {inquiry.business_need}
              </dd>
            </div>
          </dl>
        </section>

        <aside className="h-fit rounded-xl border bg-card p-4 sm:p-5">
          <InquiryStatusForm inquiryId={inquiry.id} status={inquiry.status} />
          <p className="mt-4 text-xs text-muted-foreground">
            Consent version: {inquiry.consent_text_version}
          </p>
        </aside>
      </div>
    </main>
  );
}
