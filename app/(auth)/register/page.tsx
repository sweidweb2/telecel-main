import { redirect } from "next/navigation";

import { authPath } from "@/constants/routes";
import { getRequestLocale } from "@/lib/i18n/request-locale";

export default async function RegisterRedirectPage() {
  const locale = await getRequestLocale();
  redirect(authPath(locale, "signup"));
}
