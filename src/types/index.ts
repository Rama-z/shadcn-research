// ─── User ───────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
}

// ─── Role ───────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  createdAt: string;
}

// ─── Permission ─────────────────────────────────────
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "create" | "read" | "update" | "delete";
}

// ─── Auth ───────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}

// ─── Dashboard ──────────────────────────────────────
export interface KPIMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  icon: string;
}

// ─── Pagination ─────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface TableFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
