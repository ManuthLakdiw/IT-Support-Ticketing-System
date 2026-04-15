import type { Metadata } from "next";
import Link from "next/link";
import {
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { cookies } from "next/headers";
import { Badge } from "@/components/ui/badge";
import { ticketService as ticketsApi } from "@/services/ticketService";
import type { TicketStatus, Ticket as TicketType } from "@/types/ticket";
import { DashboardWelcome } from "./DashboardWelcome";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG = {
  OPEN: {
    label: "Open",
    className:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  RESOLVED: {
    label: "Resolved",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
} as const;

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  sub: string;
}) {
  return (
    <div className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${color}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} bg-opacity-15`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const result = await ticketsApi.getAll({ limit: 50 }); // fetch enough for stats
  const tickets: TicketType[] = result.ok ? result.data.data : [];

  const userInfoStr = cookies().get("user_info")?.value;
  let isAdmin = false;
  try {
    if (userInfoStr) {
      const u = JSON.parse(decodeURIComponent(userInfoStr));
      isAdmin = u.role === "ADMIN";
    }
  } catch { /* ignore */ }

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  const recent = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-full">
      <div className="flex items-center justify-between">
        <DashboardWelcome />
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tickets"
          value={total}
          icon={Ticket}
          color="bg-indigo-500 text-indigo-600"
          sub={total === 0 ? "No tickets yet" : `${open + inProgress} active`}
        />
        <StatCard
          label="Open"
          value={open}
          icon={AlertCircle}
          color="bg-sky-500 text-sky-600"
          sub={open === 0 ? "All caught up!" : "Awaiting attention"}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          icon={Clock}
          color="bg-amber-500 text-amber-600"
          sub="Being worked on"
        />
        <StatCard
          label="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="bg-emerald-500 text-emerald-600"
          sub={resolved === 0 ? "None resolved yet" : "Great progress!"}
        />
      </div>

      {!result.ok && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 text-sm text-amber-600 dark:text-amber-400">
          <strong>Note:</strong> Could not reach the backend — showing empty
          stats. Make sure the NestJS server is running on port 3000.
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h2 className="font-semibold text-base">Recent Tickets</h2>
          <Link
            href="/dashboard/tickets"
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recent.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No tickets yet.{" "}
              <Link
                href="/dashboard/tickets/new"
                className="text-indigo-600 hover:underline"
              >
                Create your first one
              </Link>
              .
            </div>
          ) : (
            recent.map((ticket) => {
              const status =
                STATUS_CONFIG[ticket.status as TicketStatus];
              const timeAgo = formatRelativeTime(ticket.createdAt);
              return (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <Ticket className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`shrink-0 ml-4 text-[11px] font-medium border-0 ${status.className}`}
                  >
                    {status.label}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
