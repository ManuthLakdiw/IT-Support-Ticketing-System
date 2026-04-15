"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearCredentials } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, User, Shield, Lock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";


interface MessageState {
  type: "success" | "error";
  text: string;
}


export default function SettingsPage() {
  const { user, hydrated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => {
        dispatch(clearCredentials());
        router.replace("/login");
      });
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, dispatch, router]);


  if (!hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    router.replace("/login");
    return null;
  }

  const displayName = user.name || user.email.split("@")[0];


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from your current password." });
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errText = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message ?? "Failed to update password. Please try again.";
        setMessage({ type: "error", text: errText });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({
        type: "success",
        text: "Password updated successfully! Logging you out for security…",
      });
      setCountdown(3);
    } catch {
      setMessage({ type: "error", text: "A network error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="max-w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">View your account details and manage your password.</p>
      </div>

      {/* ── Profile Card ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <User className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-lg">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge
              variant="secondary"
              className={
                user.role === "ADMIN"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }
            >
              {user.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Change Password ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Change Password</h2>
            <p className="text-xs text-muted-foreground">You will be signed out immediately after a successful update.</p>
          </div>
        </div>

        {/* Message banner */}
        {message && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <div className="flex-1">
              <p>{message.text}</p>
              {countdown !== null && countdown > 0 && (
                <p className="mt-1 text-xs font-medium opacity-80">
                  Redirecting to login in {countdown} second{countdown !== 1 ? "s" : ""}…
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            {
              id: "currentPassword",
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
            },
            {
              id: "newPassword",
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
            },
            {
              id: "confirmPassword",
              label: "Confirm New Password",
              value: confirmPassword,
              setter: setConfirmPassword,
            },
          ].map(({ id, label, value, setter }) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={id} className="block text-sm font-medium">
                {label}
              </label>
              <input
                id={id}
                type="password"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder="••••••••"
                disabled={isSaving || countdown !== null}
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || countdown !== null}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying & Updating…
                </>
              ) : countdown !== null ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing out…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
