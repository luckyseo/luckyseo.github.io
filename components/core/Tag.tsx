import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: "neutral" | "wine" | "pine" | "clay" | "ink";
};

export function Tag({ children, tone = "neutral", className, ...props }: TagProps) {
  return (
    <span className={cn("tag", `tag--${tone}`, className)} {...props}>
      {children}
    </span>
  );
}
