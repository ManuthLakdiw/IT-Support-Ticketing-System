import { cn } from "@/lib/utils";

/**
 * Shadcn-style Skeleton — a pulsing placeholder for async content.
 * Compatible with Tailwind v3 + the @base-ui/react setup.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
