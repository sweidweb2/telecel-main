export type UserRole = "admin" | "editor";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  /** Null = no CMS access (account exists but was never granted a role). */
  role: UserRole | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserListResult = {
  users: Profile[];
  total: number;
  totalPages: number;
};

export type UserStats = {
  total: number;
  admins: number;
  editors: number;
  noAccess: number;
  newThisWeek: number;
  newThisMonth: number;
};
