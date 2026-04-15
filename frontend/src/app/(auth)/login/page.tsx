"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginFormState } from "./auth-actions";
import { Ticket, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials, type AuthUser } from "@/redux/features/authSlice";

const initialState: LoginFormState = {};

function readUserFromCookie(): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_info="));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state.success) {
      const user = readUserFromCookie();
      if (user) dispatch(setCredentials({ user }));
      router.replace("/dashboard");
    }
  }, [state.success, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-900/50">
              <Ticket className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">IT Support Portal</h1>
              <p className="mt-1 text-sm text-slate-400">Sign in to manage your tickets</p>
            </div>
          </div>

          {state.errors?._form && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{state.errors._form[0]}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
              />
              {state.errors?.email && (
                <p className="text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
              />
              {state.errors?.password && (
                <p className="text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>

            <SubmitButton />
          </form>

          <div className="mt-8 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Demo credentials
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p><span className="font-medium text-slate-300">Admin:</span> admin@support.com / Admin1234!</p>
              <p><span className="font-medium text-slate-300">User:</span> user@support.com / User1234!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
