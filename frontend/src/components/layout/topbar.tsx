"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearCredentials } from "@/redux/features/authSlice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  tickets: "My Tickets",
  settings: "Settings",
  admin: "Admin Panel",
  new: "New Ticket",
};

function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-1.5 text-sm">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label = ROUTE_LABELS[seg] ?? seg;
        return (
          <span key={seg} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/40 select-none">/</span>}
            <span className={cn(isLast ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Topbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (!pathname.startsWith("/dashboard/tickets")) setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q) {
      router.push(`/dashboard/tickets?q=${encodeURIComponent(q)}&page=1`);
    } else {
      router.push("/dashboard/tickets");
    }
  }, [debouncedQuery]);

  const performLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearCredentials());
    router.replace("/login");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const nameInitial = displayName.charAt(0).toUpperCase();
  const roleLabel = user?.role ?? "USER";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
      <Breadcrumb />

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            id="ticket-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets…"
            aria-label="Search tickets"
            className={cn(
              "h-9 w-52 rounded-xl border border-border bg-muted/40 pl-8 pr-3",
              "text-sm text-foreground placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/50",
              "transition-all duration-200 focus:w-64"
            )}
          />
        </div>

        <ThemeToggle />

        {/* Notification Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>

        <div className="h-6 w-px bg-border/60 mx-1" />

        {/* User Avatar + Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-muted/60 transition-colors focus:outline-none"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold dark:bg-indigo-900/40 dark:text-indigo-300">
                {nameInitial}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-none text-foreground max-w-[120px] truncate">
                {displayName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge
                  variant="secondary"
                  className="h-3.5 px-1 text-[9px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                >
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* FIX: explicit text-red-500 on both default and focused states */}
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
              onClick={() => setShowLogoutDialog(true)}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutDialog}
        title="Sign out"
        description="Are you sure you want to sign out of IT Support Portal?"
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        variant="default"
        onConfirm={performLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </header>
  );
}
