"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";

interface EditTicketPageProps {
  params: { id: string };
}

export default function EditTicketPage({ params }: EditTicketPageProps) {
  const router = useRouter();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── Load current ticket data ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setLoadError(null);

      const res = await fetch(`/api/tickets/${id}`).catch(() => null);

      if (!res || !res.ok) {
        if (!cancelled) {
          setLoadError("Failed to load ticket. It may not exist or you may not have access.");
          setIsLoading(false);
        }
        return;
      }

      const ticket = await res.json();

      if (!cancelled) {
        // Guard: if the ticket is not OPEN, redirect away immediately
        if (ticket.status !== "OPEN") {
          router.replace(`/dashboard/tickets/${id}`);
          return;
        }
        setTitle(ticket.title ?? "");
        setDescription(ticket.description ?? "");
        setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, router]);

  // ── Handle form submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    // Client-side validation
    const trimTitle = title.trim();
    const trimDesc = description.trim();

    if (!trimTitle || trimTitle.length < 5) {
      setSaveError("Title must be at least 5 characters.");
      return;
    }
    if (trimTitle.length > 120) {
      setSaveError("Title must be 120 characters or fewer.");
      return;
    }
    if (!trimDesc || trimDesc.length < 10) {
      setSaveError("Description must be at least 10 characters.");
      return;
    }

    setIsSaving(true);

    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimTitle, description: trimDesc }),
    });

    setIsSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      const errText = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message ?? "Failed to save changes. Please try again.";
      setSaveError(errText);
      return;
    }

    // Success — navigate back to the detail page
    router.replace(`/dashboard/tickets/${id}`);
    router.refresh();
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-full space-y-6">
        <Link
          href={`/dashboard/tickets/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to ticket
        </Link>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          <p className="font-semibold">Could not load ticket</p>
          <p className="mt-1 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  const titleLen = title.trim().length;
  const descLen = description.trim().length;

  return (
    <div className="max-w-full space-y-6">
      {/* Back navigation */}
      <Link
        href={`/dashboard/tickets/${id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to ticket
      </Link>

      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {/* Header */}
        <div className="mb-6 border-b border-border/60 pb-5">
          <h1 className="text-2xl font-bold tracking-tight">Edit Ticket</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You can only edit tickets that are still{" "}
            <span className="font-medium text-sky-600">Open</span>. Changes are
            saved immediately.
          </p>
        </div>

        {/* Error banner */}
        {saveError && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{saveError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="title" className="block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${titleLen > 120 ? "text-red-500" : "text-muted-foreground"}`}>
                {titleLen}/120
              </span>
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={130}
              placeholder="Brief summary of the issue…"
              className="w-full rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
            />
            {titleLen < 5 && titleLen > 0 && (
              <p className="text-xs text-muted-foreground">At least 5 characters required</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-muted-foreground">{descLen} chars</span>
            </div>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail. Include any steps to reproduce, error messages, or relevant context…"
              className="w-full resize-none rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
            />
            {descLen < 10 && descLen > 0 && (
              <p className="text-xs text-muted-foreground">At least 10 characters required</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <Link
              href={`/dashboard/tickets/${id}`}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
