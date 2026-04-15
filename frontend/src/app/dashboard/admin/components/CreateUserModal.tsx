"use client";

import { useState, useTransition } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";

interface CreateUserModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateUserModal({ onClose, onCreated }: CreateUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "ADMIN" | "USER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to create user.");
          return;
        }
        onCreated();
        onClose();
      } catch {
        setError("Network error. Please try again.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Create New User</h2>
            <p className="text-xs text-muted-foreground">Add a new employee account</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Jane Smith" },
            { label: "Email Address", key: "email", type: "email", placeholder: "jane@company.com" },
            { label: "Password", key: "password", type: "password", placeholder: "Min. 8 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-sm font-medium">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "USER" }))}
              className="w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-indigo-500/60"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
