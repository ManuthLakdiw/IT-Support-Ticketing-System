import { cookies } from "next/headers";


export const API_URL = process.env.API_URL ?? "http://localhost:3000/api";


export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}


function getToken(): string | null {
  return cookies().get("access_token")?.value ?? null;
}


export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  tags?: string[];
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiResult<T>> {
  const { body, tags, ...rest } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      ...(tags ? { next: { tags } } : {}),
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const err = await response.json();
        if (typeof err.message === "string") errorMessage = err.message;
        else if (Array.isArray(err.message)) errorMessage = err.message.join("; ");
      } catch {
      }
      return { ok: false, error: errorMessage };
    }

    if (response.status === 204) return { ok: true, data: null as T };

    return { ok: true, data: (await response.json()) as T };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected network error occurred.";
    return { ok: false, error: message };
  }
}
