import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/core/Icon";
import { cn } from "@/lib/cn";

type CommonProps = {
  children: ReactNode;
  icon?: string;
  iconLeading?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost" | "link";
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button(props: ButtonProps | AnchorProps) {
  const {
    children,
    icon,
    iconLeading,
    size = "md",
    variant = "solid",
    className,
    ...rest
  } = props;
  const content = (
    <>
      {iconLeading ? <Icon name={iconLeading} size={size === "lg" ? 18 : 16} /> : null}
      <span>{children}</span>
      {icon ? <Icon name={icon} size={size === "lg" ? 18 : 16} /> : null}
    </>
  );
  const classes = cn("button", `button--${variant}`, `button--${size}`, className);

  if ("href" in props && props.href) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} href={props.href}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
