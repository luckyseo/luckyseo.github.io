import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/app/_components/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
};

export function Card({ children, interactive, className, ...props }: CardProps) {
  return (
    <div className={cn("card", interactive && "card--interactive", className)} {...props}>
      {children}
    </div>
  );
}
