"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render nothing until client has mounted
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder maintains the same dimensions so the layout doesn't shift
    return (
      <div
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl",
          "border border-border/60 bg-muted/30",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      id="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "border border-border/60 bg-muted/30",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "transition-colors duration-200",
        className
      )}
    >
      {/* Sun icon — shown in dark mode, fades out in light */}
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
        )}
      />
      {/* Moon icon — shown in light mode, fades out in dark */}
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
    </button>
  );
}
