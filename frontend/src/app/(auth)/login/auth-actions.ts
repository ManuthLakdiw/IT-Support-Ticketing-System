"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3000/api";

export interface LoginFormState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  // Basic validation
  const errors: LoginFormState["errors"] = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["Please enter a valid email address."];
  }
  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters."];
  }
  if (Object.keys(errors).length > 0) return { errors };

  let tokenData: { access_token: string; user: { id: string; email: string; name: string; role: string } };

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      let message = "Invalid email or password.";
      try {
        const body = await res.json();
        if (typeof body.message === "string") message = body.message;
      } catch { /* ignore */ }
      return { errors: { _form: [message] } };
    }

    tokenData = await res.json();
  } catch {
    return { errors: { _form: ["Could not reach the server. Is the backend running?"] } };
  }

  const cookieStore = await cookies();
  cookieStore.set("access_token", tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set(
    "user_info",
    JSON.stringify({
      id: tokenData.user.id,
      email: tokenData.user.email,
      name: tokenData.user.name,
      role: tokenData.user.role,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  return { success: true };
}
