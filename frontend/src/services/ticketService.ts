import { apiFetch, type ApiResult, type PaginatedResult } from "./apiClient";
import type { Ticket } from "@/types/ticket";


export interface GetTicketsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface CreateTicketDto {
  title: string;
  description: string;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
}


export const ticketService = {
  getAll(params?: GetTicketsParams): Promise<ApiResult<PaginatedResult<Ticket>>> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.q?.trim()) query.set("q", params.q.trim());
    const qs = query.toString();
    return apiFetch<PaginatedResult<Ticket>>(
      `/tickets${qs ? `?${qs}` : ""}`,
      { tags: ["tickets"] }
    );
  },


  getOne(id: string): Promise<ApiResult<Ticket>> {
    return apiFetch<Ticket>(`/tickets/${id}`, { tags: [`ticket-${id}`] });
  },

  create(data: CreateTicketDto): Promise<ApiResult<Ticket>> {
    return apiFetch<Ticket>("/tickets", { method: "POST", body: data });
  },


  update(id: string, data: UpdateTicketDto): Promise<ApiResult<Ticket>> {
    return apiFetch<Ticket>(`/tickets/${id}`, { method: "PATCH", body: data });
  },


  updateStatus(id: string, status: string): Promise<ApiResult<Ticket>> {
    return apiFetch<Ticket>(`/tickets/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },


  delete(id: string): Promise<ApiResult<{ message: string }>> {
    return apiFetch<{ message: string }>(`/tickets/${id}`, { method: "DELETE" });
  },
};
