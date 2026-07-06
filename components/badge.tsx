import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The text label displayed inside the badge
   */
  text: string;

  /**
   * Custom Tailwind background classes for the core center dot
   * @default "bg-emerald-500"
   */
  dotClassName?: string;

  /**
   * Custom Tailwind background classes for the outer expanding animated ring
   * @default "bg-emerald-400"
   */
  pingClassName?: string;

  /**
   * Toggles the presence of the pulsing dot entirely
   * @default true
   */
  showDot?: boolean;
}

export function Badge({
  text,
  dotClassName = "bg-emerald-500",
  pingClassName = "bg-emerald-400",
  showDot = true,
  className,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-foreground/10 text-xs
         font-medium text-foreground/90 shadow-sm select-none w-fit transition-colors hover:border-border-foreground/10`,
        className
      )}
      {...props}
    >
      {/* 🔴 The Pulsing Indicator Dot Wrapper */}
      {showDot && (
        <span className="relative flex h-2 w-2 shrink-0">
          {/* Outward expanding ring animation */}
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", pingClassName)} />
          {/* Static core center dot */}
          <span className={cn("relative inline-flex rounded-full h-2 w-2", dotClassName)} />
        </span>
      )}

      {/* 📝 Text Label Context */}
      <span>{text}</span>
    </div>
  );
}