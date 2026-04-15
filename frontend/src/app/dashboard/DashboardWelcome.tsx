"use client";

import { useAppSelector } from "@/redux/hooks";

export function DashboardWelcome() {
  const { user } = useAppSelector((state) => state.auth);
  const displayName = user?.name || user?.email?.split("@")[0] || "there";

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Welcome back, {displayName}! 👋
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Here&apos;s what&apos;s happening with your support tickets today.
      </p>
    </div>
  );
}
