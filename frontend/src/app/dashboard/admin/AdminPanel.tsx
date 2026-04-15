"use client";

import { useState, useCallback } from "react";
import { Pencil, Trash2, ShieldCheck, UserPlus, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CreateUserModal } from "./components/CreateUserModal";
import { EditUserModal } from "./components/EditUserModal";
import type { AdminUser } from "@/services/userService";


interface DialogState {
  type: "delete" | "toggle" | null;
  user: AdminUser | null;
}

export default function AdminPanel({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: null, user: null });
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDeleteConfirmed = async () => {
    const user = dialog.user;
    if (!user) return;
    setDialog({ type: null, user: null });
    setDeletingId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) setUsers((u) => u.filter((x) => x.id !== user.id));
  };

  // ── Status toggle — only for USER role accounts ───────────────────────────

  const handleToggleConfirmed = async () => {
    const user = dialog.user;
    if (!user) return;
    setDialog({ type: null, user: null });
    setTogglingId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    setTogglingId(null);
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    }
  };

  const openDialog = (type: "delete" | "toggle", user: AdminUser) => {
    setDialog({ type, user });
  };

  return (
    <div className="max-w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage user accounts and access</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: users.length, colorClass: "text-indigo-600" },
          { label: "Active", value: users.filter((u) => u.isActive).length, colorClass: "text-emerald-600" },
          { label: "Suspended", value: users.filter((u) => !u.isActive).length, colorClass: "text-red-500" },
        ].map(({ label, value, colorClass }) => (
          <div key={label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${colorClass}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* User Table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60">
          <h2 className="font-semibold">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((user) => {
                const isUserRole = user.role === "USER";

                return (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.name || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* ── Status toggle — ADMIN-only, USER accounts only ── */}
                        {isUserRole && (
                          <button
                            onClick={() => openDialog("toggle", user)}
                            disabled={togglingId === user.id}
                            title={user.isActive ? "Suspend user" : "Activate user"}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 ${
                              user.isActive
                                ? "border-amber-200 text-amber-500 hover:bg-amber-50 dark:border-amber-900/40 dark:hover:bg-amber-900/20"
                                : "border-emerald-200 text-emerald-500 hover:bg-emerald-50 dark:border-emerald-900/40 dark:hover:bg-emerald-900/20"
                            }`}
                          >
                            {togglingId === user.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : user.isActive ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {/* ── Edit ── */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit user"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* ── Delete ── */}
                        <button
                          onClick={() => openDialog("delete", user)}
                          disabled={deletingId === user.id}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === user.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={refresh} />}
      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onUpdated={refresh} />}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={dialog.type === "delete"}
        title="Delete User"
        description={`Permanently delete "${dialog.user?.name || dialog.user?.email}"? All their data will be lost and this cannot be undone.`}
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDialog({ type: null, user: null })}
      />

      {/* Status Toggle Confirmation */}
      <ConfirmDialog
        open={dialog.type === "toggle"}
        title={dialog.user?.isActive ? "Suspend User" : "Activate User"}
        description={
          dialog.user?.isActive
            ? `Suspend "${dialog.user?.name || dialog.user?.email}"? They will immediately lose the ability to log in.`
            : `Activate "${dialog.user?.name || dialog.user?.email}"? They will be able to log in again.`
        }
        confirmLabel={dialog.user?.isActive ? "Suspend" : "Activate"}
        cancelLabel="Cancel"
        variant={dialog.user?.isActive ? "destructive" : "default"}
        onConfirm={handleToggleConfirmed}
        onCancel={() => setDialog({ type: null, user: null })}
      />
    </div>
  );
}
