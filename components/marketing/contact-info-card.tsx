import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { ContactLabels } from "@/components/marketing/contact-labels";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTACT } from "@/constants/contact";

type ContactInfoCardProps = {
  labels: ContactLabels;
};

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <div className="text-sm leading-relaxed text-pretty">{children}</div>
      </div>
    </div>
  );
}

export function ContactInfoCard({ labels }: ContactInfoCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>{labels.infoTitle}</CardTitle>
        <CardDescription>{labels.infoDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <InfoRow icon={<MapPinIcon className="size-4" />} label={labels.addressLabel}>
          <p>
            {CONTACT.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </InfoRow>
        <InfoRow icon={<MailIcon className="size-4" />} label={labels.emailLabel}>
          <a
            href={CONTACT.emailHref}
            className="break-all text-foreground underline-offset-4 hover:underline"
          >
            {CONTACT.email}
          </a>
        </InfoRow>
        <InfoRow icon={<PhoneIcon className="size-4" />} label={labels.phoneLabel}>
          <a
            href={CONTACT.phoneHref}
            className="text-foreground underline-offset-4 hover:underline"
          >
            {CONTACT.phone}
          </a>
        </InfoRow>
      </CardContent>
    </Card>
  );
}
