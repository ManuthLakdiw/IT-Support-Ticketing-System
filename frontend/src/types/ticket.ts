export type Role = "ADMIN" | "USER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export interface TicketUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: TicketUser;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
