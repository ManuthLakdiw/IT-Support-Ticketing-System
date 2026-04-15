import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Ticket as TicketIcon, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Ticket, TicketStatus } from "@/types/ticket";


const STATUS: Record<
  TicketStatus,
  { label: string; className: string; dotClass: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    dotClass: "bg-sky-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    dotClass: "bg-amber-500",
  },
  RESOLVED: {
    label: "Resolved",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
  },
};


export function TicketCard({ ticket }: { ticket: Ticket }) {
  const status = STATUS[ticket.status];
  const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), {
    addSuffix: true,
  });

  return (
    <Link
      href={`/dashboard/tickets/${ticket.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5",
        "transition-all duration-200"
      )}
    >
      {/* ── Status badge + Date ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", status.dotClass)}
          />
          <Badge
            className={cn(
              "border-0 text-[11px] font-medium px-2 py-0.5",
              status.className
            )}
          >
            {status.label}
          </Badge>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </span>
      </div>

      {/* ── Title ── */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
          <TicketIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {ticket.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* ── Creator ── */}
      <div className="flex items-center gap-1.5 border-t border-border/50 pt-3">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">
          {ticket.createdBy.name || ticket.createdBy.email}
        </span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/50">
          #{ticket.id.slice(0, 8)}
        </span>
      </div>
    </Link>
  );
}
