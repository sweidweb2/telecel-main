export type UserRole = "admin" | "editor" | "viewer";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
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
  viewers: number;
  newThisWeek: number;
  newThisMonth: number;
};
