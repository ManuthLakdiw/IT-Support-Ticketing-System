import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Plus, RefreshCcw, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { ticketService as ticketsApi } from "@/services/ticketService";
import { TicketCard } from "@/components/tickets/TicketCard";
import type { Ticket, TicketStatus } from "@/types/ticket";

export const metadata: Metadata = { title: "Tickets" };
export const dynamic = "force-dynamic";

const LIMIT = 9; // tickets per page


const STATUS_FILTERS: { label: string; value: TicketStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
];


function getDateGroup(dateStr: string): "today" | "lastWeek" | "older" {
  const now = new Date();
  const ticketDate = new Date(dateStr);
  const diffMs = now.getTime() - ticketDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return "today";
  if (diffDays < 7) return "lastWeek";
  return "older";
}

interface DateGroups {
  today: Ticket[];
  lastWeek: Ticket[];
  older: Ticket[];
}

function groupByDate(tickets: Ticket[]): DateGroups {
  return tickets.reduce<DateGroups>(
    (acc, t) => {
      acc[getDateGroup(t.createdAt)].push(t);
      return acc;
    },
    { today: [], lastWeek: [], older: [] }
  );
}


interface PageProps {
  searchParams?: { status?: string; q?: string; page?: string };
}

export default async function TicketsPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const statusFilter = searchParams?.status ?? "ALL";
  const searchQuery = searchParams?.q?.toLowerCase().trim() ?? "";

  const userInfoStr = cookies().get("user_info")?.value;
  let isAdmin = false;
  try {
    if (userInfoStr) {
      const u = JSON.parse(decodeURIComponent(userInfoStr));
      isAdmin = u.role === "ADMIN";
    }
  } catch { /* ignore */ }

  const result = await ticketsApi.getAll({ page, limit: LIMIT, q: searchQuery || undefined });

  if (!result.ok) {
    return (
      <div className="max-w-full space-y-6">
        <PageHeader isAdmin={isAdmin} />
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <RefreshCcw className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-destructive">Failed to load tickets</h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">{result.error}</p>
          </div>
          <Link
            href="/dashboard/tickets"
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Link>
        </div>
      </div>
    );
  }

  const { data: allTickets, meta } = result.data;

  const tickets = statusFilter === "ALL"
    ? allTickets
    : allTickets.filter((t) => t.status === statusFilter);

  const counts = allTickets.reduce(
    (acc, t) => { acc[t.status] = (acc[t.status] ?? 0) + 1; return acc; },
    {} as Record<string, number>
  );

  const groups = groupByDate(tickets);
  const hasAny = tickets.length > 0;

  return (
    <div className="max-w-full space-y-6">
      <PageHeader isAdmin={isAdmin} />

      {/* ── Status filter tabs ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_FILTERS.map(({ label, value }) => {
          const count = value === "ALL" ? meta.total : (counts[value] ?? 0);
          const isActive = statusFilter === value;
          return (
            <Link
              key={value}
              href={{
                pathname: "/dashboard/tickets",
                query: {
                  ...(value !== "ALL" ? { status: value } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  page: "1",
                },
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
              <span
                className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Ticket Grid — grouped by date ── */}
      {!hasAny ? (
        <EmptyState isAdmin={isAdmin} hasFilter={statusFilter !== "ALL"} />
      ) : (
        <div className="space-y-8">
          <DateSection label="Today" tickets={groups.today} />
          <DateSection label="Last 7 Days" tickets={groups.lastWeek} />
          <DateSection label="Older" tickets={groups.older} />
        </div>
      )}

      {/* ── Pagination controls ── */}
      {meta.lastPage > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-5 py-3 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
            <span className="font-semibold text-foreground">{meta.lastPage}</span>
            <span className="ml-2 text-xs">({meta.total} total)</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={{
                pathname: "/dashboard/tickets",
                query: {
                  ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  page: String(Math.max(1, page - 1)),
                },
              }}
              aria-disabled={page <= 1}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                page <= 1
                  ? "pointer-events-none border-border/40 text-muted-foreground/40"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
            <Link
              href={{
                pathname: "/dashboard/tickets",
                query: {
                  ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
                  ...(searchQuery ? { q: searchQuery } : {}),
                  page: String(Math.min(meta.lastPage, page + 1)),
                },
              }}
              aria-disabled={page >= meta.lastPage}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                page >= meta.lastPage
                  ? "pointer-events-none border-border/40 text-muted-foreground/40"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DateSection({ label, tickets }: { label: string; tickets: Ticket[] }) {
  if (tickets.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs text-muted-foreground">{tickets.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
}

function PageHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isAdmin ? "All Tickets" : "My Tickets"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin
            ? "View and manage all support requests across the organisation."
            : "Track and manage all your support requests."}
        </p>
      </div>
      {/* Create Ticket button — hidden for ADMIN */}
      {!isAdmin && (
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Link>
      )}
    </div>
  );
}

function EmptyState({ isAdmin, hasFilter }: { isAdmin: boolean; hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-base font-semibold">
          {hasFilter ? "No tickets with this status" : "No tickets yet"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
          {hasFilter
            ? "Try a different filter or clear the search."
            : isAdmin
            ? "No support requests have been submitted yet."
            : "You haven't submitted any support requests yet."}
        </p>
      </div>
      {!isAdmin && !hasFilter && (
        <Link
          href="/dashboard/tickets/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create your first ticket
        </Link>
      )}
    </div>
  );
}
