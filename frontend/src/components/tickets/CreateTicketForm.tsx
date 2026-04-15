"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { createTicket, type CreateTicketFormState } from "@/app/dashboard/tickets/actions";
import { cn } from "@/lib/utils";


function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <ul className="mt-1.5 space-y-0.5">
      {messages.map((msg) => (
        <li key={msg} className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {msg}
        </li>
      ))}
    </ul>
  );
}

function FormAlert({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        {messages.map((msg) => (
          <p key={msg}>{msg}</p>
        ))}
      </div>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string[];
  hint?: string;
  multiline?: boolean;
  rows?: number;
}

function Field({ id, label, error, hint, multiline, rows = 5, className, ...props }: FieldProps) {
  const hasError = error && error.length > 0;
  const baseClass = cn(
    "w-full rounded-xl border bg-background px-4 py-2.5 text-sm",
    "placeholder:text-muted-foreground/50",
    "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary/50",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-colors duration-150",
    hasError
      ? "border-destructive/60 focus:ring-destructive/20 focus:border-destructive"
      : "border-border",
    className
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        <span className="ml-0.5 text-destructive">*</span>
      </label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          className={baseClass}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          name={id}
          className={baseClass}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      <FieldError messages={error} />
    </div>
  );
}

// ── Submit & Cancel Buttons (must be in their own components to use useFormStatus) ──

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white",
        "shadow-lg shadow-indigo-600/20 hover:bg-indigo-700",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition-all duration-150"
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Submit Ticket
        </>
      )}
    </button>
  );
}

function CancelButton() {
  const { pending } = useFormStatus();
  return (
    <a
      href="/dashboard/tickets"
      className={cn(
        "inline-flex h-10 items-center rounded-xl border border-border px-5 text-sm font-medium",
        "text-muted-foreground hover:bg-muted transition-colors",
        pending && "pointer-events-none opacity-40"
      )}
    >
      Cancel
    </a>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const initialState: CreateTicketFormState = {};

export function CreateTicketForm() {
  // useFormState is the React 18 equivalent of useActionState (React 19)
  const [state, formAction] = useFormState(createTicket, initialState);

  return (
    <form
      action={formAction}
      className="space-y-5"
      noValidate
    >
      {/* ── Top-level form error (auth / network) ── */}
      <FormAlert messages={state.errors?._form} />

      {/* ── Title ── */}
      <Field
        id="title"
        label="Issue Title"
        placeholder="e.g. Cannot access VPN"
        error={state.errors?.title}
        hint="Briefly describe the issue (5–120 characters)."
        defaultValue=""
      />

      {/* ── Description ── */}
      <Field
        id="description"
        label="Description"
        placeholder="Describe the issue in detail — include any error messages, steps you've already tried, and when the problem started."
        error={state.errors?.description}
        hint="The more detail you add, the faster the team can help (min 10 characters)."
        multiline
        rows={6}
        defaultValue=""
      />

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <CancelButton />
        <SubmitButton />
      </div>
    </form>
  );
}
