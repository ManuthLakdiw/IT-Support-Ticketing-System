import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ticketService as ticketsApi } from "@/services/ticketService";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Ticket as TicketIcon, User, Pencil } from "lucide-react";
import type { TicketStatus } from "@/types/ticket";
import { TicketActions } from "./TicketActions";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Ticket Details" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<TicketStatus, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  IN_PROGRESS: { label: "In Progress", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  RESOLVED: { label: "Resolved", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
};

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const result = await ticketsApi.getOne(params.id);

  if (!result.ok) {
    if (result.error.includes("404") || result.error.includes("not found")) notFound();
    return (
      <div className="max-w-4xl space-y-6">
        <Link href="/dashboard/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Error loading ticket</p>
          <p className="text-sm mt-1">{result.error}</p>
        </div>
      </div>
    );
  }

  const ticket = result.data;
  const status = STATUS_CONFIG[ticket.status];

  // Read role from user_info cookie (server-side) for rendering action buttons
  const userInfoStr = cookies().get("user_info")?.value;
  let currentUserId = "";
  let currentRole = "USER";
  try {
    if (userInfoStr) {
      const u = JSON.parse(decodeURIComponent(userInfoStr));
      currentUserId = u.id;
      currentRole = u.role;
    }
  } catch { /* ignore */ }

  const isOwner = ticket.createdById === currentUserId;
  const isAdmin = currentRole === "ADMIN";
  const canDelete = isOwner && (ticket.status === "OPEN" || ticket.status === "IN_PROGRESS");
  // Edit is only allowed for OPEN tickets by the owner (not admin)
  const canEdit = isOwner && !isAdmin && ticket.status === "OPEN";

  const date = new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = new Date(ticket.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="max-w-full space-y-6">
      <Link href="/dashboard/tickets" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to tickets
      </Link>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <TicketIcon className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {time}</span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {ticket.createdBy.name || ticket.createdBy.email}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge className={`shrink-0 border-0 px-3 py-1 text-sm font-medium ${status.className}`}>
              {status.label}
            </Badge>

            {/* Edit button — OPEN tickets only, owner only */}
            {canEdit && (
              <Link
                href={`/dashboard/tickets/${ticket.id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Ticket
              </Link>
            )}

            {/* Pass only serializable data */}
            <TicketActions
              ticketId={ticket.id}
              currentStatus={ticket.status}
              isAdmin={isAdmin}
              canDelete={canDelete}
            />
          </div>
        </div>

        {/* Description */}
        <div className="pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Description</h2>
          <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>
      </div>
    </div>
  );
}
