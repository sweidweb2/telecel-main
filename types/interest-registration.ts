import type { Tables } from "@/types/database";

export type InterestRegistration = Tables<"interest_registrations">;

export type InterestRegistrationListResult = {
  registrations: InterestRegistration[];
  total: number;
  totalPages: number;
};
