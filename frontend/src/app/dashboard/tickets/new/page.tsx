import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Ticket } from "lucide-react";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";

export const metadata: Metadata = { title: "New Ticket" };

export default function NewTicketPage() {
  return (
    <div className="max-w-full space-y-6">
      {/* ── Header ── */}
      <div>
        <Link
          href="/dashboard/tickets"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to My Tickets
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
            <Ticket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Submit a Support Ticket
            </h1>
            <p className="text-sm text-muted-foreground">
              Describe your issue and the IT team will respond shortly.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        {/* Tips ── */}
        <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <p className="font-medium text-indigo-700 dark:text-indigo-300">
            Tips for a faster resolution
          </p>
          <ul className="mt-1.5 space-y-1 text-indigo-600/80 dark:text-indigo-400/80">
            <li>• Include any error codes or messages you see.</li>
            <li>• Mention which device / OS / browser is affected.</li>
            <li>• Note when the problem started and how often it occurs.</li>
          </ul>
        </div>

        <CreateTicketForm />
      </div>
    </div>
  );
}
