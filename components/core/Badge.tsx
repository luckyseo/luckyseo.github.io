import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  dot?: boolean;
  quiet?: boolean;
  tone?: "neutral" | "good";
};

export function Badge({ children, dot, quiet, tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span className={cn("badge", `badge--${tone}`, quiet && "badge--quiet", className)} {...props}>
      {dot ? <span className="badge__dot" /> : null}
      {children}
    </span>
  );
}
