import type { Enums, Tables } from "@/types/database";

export type Inquiry = Tables<"inquiries">;
export type InquiryIntent = Enums<"inquiry_intent">;
export type InquiryStatus = Enums<"inquiry_status">;
export type ContactMethod = Enums<"contact_method">;

export type InquiryListItem = Pick<
  Inquiry,
  | "id"
  | "intent"
  | "full_name"
  | "company"
  | "email"
  | "area_of_interest"
  | "status"
  | "created_at"
>;

export type InquiryListResult = {
  inquiries: InquiryListItem[];
  total: number;
  totalPages: number;
};
