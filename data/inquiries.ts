import "server-only";

import type { StaffSession } from "@/data/auth";
import type { Inquiry, InquiryListItem, InquiryListResult } from "@/types/inquiry";
import type { InquiryListQuery } from "@/validations/inquiries";

const LIST_COLUMNS =
  "id, intent, full_name, company, email, area_of_interest, status, created_at" as const;

const DETAIL_COLUMNS =
  "id, intent, full_name, company, job_role, email, country_code, area_of_interest, business_need, preferred_contact_method, consent, consent_text_version, source_path, utm, status, delivery_status, delivery_attempts, last_delivery_error, created_at, updated_at" as const;

type ServerClient = StaffSession["supabase"];

export async function listInquiries(
  session: StaffSession,
  query: InquiryListQuery
): Promise<InquiryListResult> {
  const supabase: ServerClient = session.supabase;
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let request = supabase
    .from("inquiries")
    .select(LIST_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (query.status !== "all") {
    request = request.eq("status", query.status);
  }
  if (query.intent !== "all") {
    request = request.eq("intent", query.intent);
  }
  if (query.search) {
    request = request.or(
      `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%,company.ilike.%${query.search}%`
    );
  }

  const { data, count, error } = await request;
  if (error) throw error;

  const total = count ?? 0;
  return {
    inquiries: (data ?? []) as InquiryListItem[],
    total,
    totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
  };
}

export async function getInquiryById(
  session: StaffSession,
  id: string
): Promise<Inquiry | null> {
  const { data, error } = await session.supabase
    .from("inquiries")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Inquiry | null;
}
