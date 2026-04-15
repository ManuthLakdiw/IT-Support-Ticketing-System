"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { cn } from "@/lib/utils";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div
        className={cn(
          "flex flex-1 flex-col min-w-0 overflow-hidden",
          "transition-[margin-left] duration-300 ease-in-out",
          collapsed ? "ml-[68px]" : "ml-64"
        )}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
