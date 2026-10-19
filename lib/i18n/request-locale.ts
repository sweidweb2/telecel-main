import { headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_HEADER,
  type Locale,
} from "@/constants/locales";

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const value = headerStore.get(LOCALE_HEADER);
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}
