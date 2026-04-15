"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ChevronDown, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { TicketStatus } from "@/types/ticket";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// ── State machine ─────────────────────────────────────────────────────────────
// Ticket status can ONLY flow forward. Backward transitions are strictly blocked.
//   OPEN  →  IN_PROGRESS  →  RESOLVED
//
// A status option is disabled if its rank is LOWER than the current status rank.

const STATUS_ORDER: Record<TicketStatus, number> = {
  OPEN: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
};

const STATUS_META: Record<
  TicketStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  OPEN: {
    label: "Open",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-900/20",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: Clock,
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: CheckCircle2,
  },
};

const ALL_STATUSES: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];

// ── Component ─────────────────────────────────────────────────────────────────

interface TicketActionsProps {
  ticketId: string;
  currentStatus: TicketStatus;
  isAdmin: boolean;
  canDelete: boolean;
}

export function TicketActions({
  ticketId,
  currentStatus,
  isAdmin,
  canDelete,
}: TicketActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Status machine: a status is backwards if its rank < current rank ────────
  const isBackward = (status: TicketStatus) =>
    STATUS_ORDER[status] < STATUS_ORDER[localStatus];

  // ── Handle select change ──────────────────────────────────────────────────
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as TicketStatus;
    if (!isAdmin || next === localStatus) return;

    // Extra guard — should never fire if disabled props work, but belt-and-suspenders
    if (isBackward(next)) {
      setError(`Cannot move a ticket backward from ${STATUS_META[localStatus].label}`);
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (res.ok) {
        setLocalStatus(next);
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Failed to update status. Please try again.");
      }
    });
  };

  // ── Handle delete ─────────────────────────────────────────────────────────
  const handleDeleteConfirmed = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);
    const res = await fetch(`/api/tickets/${ticketId}`, { method: "DELETE" });
    setIsDeleting(false);
    if (res.ok) router.replace("/dashboard/tickets");
  };

  const currentMeta = STATUS_META[localStatus];
  const CurrentIcon = currentMeta.icon;
  const isFullyResolved = localStatus === "RESOLVED";

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* ── Admin: State-machine status selector ── */}
        {isAdmin && (
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              {/* Spinner overlay while updating */}
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[1px]">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                </div>
              )}

              {/* Custom-styled native <select> */}
              <select
                value={localStatus}
                onChange={handleSelectChange}
                disabled={isPending || isFullyResolved}
                aria-label="Update ticket status"
                className={`
                  w-48 appearance-none rounded-xl border py-2.5 pl-10 pr-9
                  text-sm font-semibold outline-none transition-all
                  ${currentMeta.color} ${currentMeta.bg}
                  border-border/60
                  hover:border-indigo-400/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                  disabled:cursor-not-allowed disabled:opacity-50
                  cursor-pointer
                `}
              >
                {ALL_STATUSES.map((s) => {
                  const meta = STATUS_META[s];
                  const backward = isBackward(s);

                  return (
                    <option
                      key={s}
                      value={s}
                      disabled={backward}
                      className={backward ? "text-muted-foreground line-through" : ""}
                    >
                      {meta.label}
                      {backward ? " (not allowed)" : s === localStatus ? " ✓" : ""}
                    </option>
                  );
                })}
              </select>

              {/* Leading icon */}
              <CurrentIcon
                className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${currentMeta.color}`}
              />

              {/* Trailing chevron */}
              <ChevronDown
                className={`pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${currentMeta.color}`}
              />
            </div>

            {/* Flow hint */}
            {!isFullyResolved && (
              <p className="px-1 text-[11px] text-muted-foreground">
                {localStatus === "OPEN"
                  ? "→ In Progress → Resolved"
                  : "→ Resolved only"}
              </p>
            )}
            {isFullyResolved && (
              <p className="px-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ This ticket is closed
              </p>
            )}

            {/* Error message from API */}
            {error && (
              <p className="px-1 text-[11px] text-red-500">{error}</p>
            )}
          </div>
        )}

        {/* ── User: Delete button (OPEN or IN_PROGRESS only) ── */}
        {canDelete && (
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/40 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Ticket"
        description="Are you sure you want to permanently delete this ticket? This action cannot be undone."
        confirmLabel="Delete Ticket"
        cancelLabel="Keep Ticket"
        variant="destructive"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
