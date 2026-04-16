"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearCredentials } from "@/redux/features/authSlice";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  LayoutDashboard,
  Ticket,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "./SidebarContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "View Tickets", href: "/dashboard/tickets", icon: Ticket },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Admin Panel", href: "/dashboard/admin", icon: ShieldCheck },
];

function NavLink({ item, collapsed, active }: { item: NavItem; collapsed: boolean; active: boolean }) {
  const Icon = item.icon;

  const linkEl = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
        "transition-all duration-200 ease-in-out",
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
        collapsed ? "justify-center px-2.5" : ""
      )}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/50" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
          active ? "text-white" : "text-slate-400 group-hover:text-white"
        )}
      />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge && item.badge > 0 && (
        <Badge className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-semibold bg-indigo-400/20 text-indigo-300 border-0">
          {item.badge}
        </Badge>
      )}
      {collapsed && item.badge && item.badge > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-400" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>{linkEl}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return linkEl;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle } = useSidebar();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const performLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearCredentials());
    router.replace("/login");
  };

  const isActiveLink = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-screen flex-col",
          "bg-slate-900 border-r border-slate-800",
          "transition-[width] duration-300 ease-in-out overflow-hidden",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* ── Brand ── */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-5 border-b border-slate-800 shrink-0",
            collapsed && "justify-center px-3"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-900/40">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-sm font-bold tracking-tight text-white">IT Support</p>
              <p className="truncate text-[11px] text-slate-400">Ticketing System</p>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-0.5">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Main Menu
            </p>
          )}
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} active={isActiveLink(item.href)} />
            ))}
          </div>

          {/* Admin section — only visible to ADMIN role */}
          {user?.role === "ADMIN" && (
            <>
              <div className="my-4">
                <Separator className="bg-slate-800" />
              </div>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Administration
                </p>
              )}
              <div className="space-y-0.5">
                {ADMIN_ITEMS.map((item) => (
                  <NavLink key={item.href} item={item} collapsed={collapsed} active={isActiveLink(item.href)} />
                ))}
              </div>
            </>
          )}
        </nav>

        {/* ── Footer: Logout ── */}
        <div className="shrink-0 border-t border-slate-800 p-3">
          <Tooltip>
            <TooltipTrigger render={<span className="block w-full" />}>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  "text-slate-300 hover:bg-red-500/15 hover:text-red-400",
                  "transition-colors",
                  collapsed && "justify-center px-2.5"
                )}
              >
                <LogOut className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </div>

        {/* ── Collapse Toggle ── */}
        <button
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-3 top-[76px] z-50",
            "flex h-6 w-6 items-center justify-center rounded-full",
            "border border-slate-700 bg-slate-900",
            "text-slate-400 hover:text-white",
            "shadow-md transition-colors"
          )}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

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
    </>
  );
}
