import type { ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/core/Icon";
import { cn } from "@/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string;
  label: string;
  size?: "sm" | "md";
  variant?: "ghost" | "outline";
};

export function IconButton({
  name,
  label,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn("icon-button", `icon-button--${size}`, `icon-button--${variant}`, className)}
      title={label}
      {...props}
    >
      <Icon name={name} size={size === "sm" ? 16 : 18} />
    </button>
  );
}
