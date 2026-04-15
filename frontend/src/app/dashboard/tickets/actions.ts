"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Ticket, ApiResult } from "@/types/ticket";

const API_URL = process.env.API_URL ?? "http://localhost:3000/api";


function getToken(): string | null {
  const cookieStore = cookies();
  return cookieStore.get("access_token")?.value ?? null;
}


export interface CreateTicketFormState {
  errors?: {
    title?: string[];
    description?: string[];
    _form?: string[];
  };
  success?: boolean;
  data?: Ticket;
}

export async function createTicket(
  prevState: CreateTicketFormState,
  formData: FormData
): Promise<CreateTicketFormState> {
  const title = formData.get("title")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";

  const fieldErrors: CreateTicketFormState["errors"] = {};

  if (!title || title.length < 5) {
    fieldErrors.title = ["Title must be at least 5 characters."];
  }
  if (title.length > 120) {
    fieldErrors.title = ["Title must be 120 characters or fewer."];
  }
  if (!description || description.length < 10) {
    fieldErrors.description = ["Description must be at least 10 characters."];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { errors: fieldErrors };
  }

  const token = getToken();

  if (!token) {
    return {
      errors: {
        _form: [
          "You must be logged in to create a ticket. Please sign in first.",
        ],
      },
    };
  }

  let result: ApiResult<Ticket>;

  try {
    const res = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const body = await res.json();
        if (typeof body.message === "string") message = body.message;
        else if (Array.isArray(body.message)) message = body.message.join("; ");
      } catch {
      }
      result = { ok: false, error: message };
    } else {
      const data = (await res.json()) as Ticket;
      result = { ok: true, data };
    }
  } catch (err) {
    result = {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Could not reach the server. Is the backend running?",
    };
  }

  if (!result.ok) {
    return { errors: { _form: [result.error] } };
  }

  revalidateTag("tickets");

  redirect("/dashboard/tickets");
}
