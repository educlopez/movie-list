import clsx from "clsx";
import Link, { type LinkProps } from "next/link";
import type { ComponentPropsWithoutRef, ReactNode, SVGProps } from "react";

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const variantStyles = {
  primary:
    "rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300",
  secondary:
    "rounded-full bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
  filled:
    "rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400",
  outline:
    "rounded-full py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white",
  text: "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500",
  disabled:
    "opacity-50 cursor-not-allowed rounded-full bg-zinc-900 py-1 px-3 text-white dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 ",
} as const;

type ButtonVariant = keyof typeof variantStyles;

interface SharedProps {
  arrow?: "left" | "right";
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

type ButtonAsButton = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  Omit<LinkProps, keyof SharedProps> &
  Omit<ComponentPropsWithoutRef<"a">, keyof SharedProps | keyof LinkProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  className,
  children,
  arrow,
  ...props
}: ButtonProps) {
  const combinedClassName = clsx(
    "inline-flex justify-center gap-0.5 overflow-hidden font-medium text-sm transition",
    variantStyles[variant],
    className
  );

  const arrowIcon = (
    <ArrowIcon
      className={clsx(
        "mt-0.5 h-5 w-5",
        variant === "text" && "relative top-px",
        arrow === "left" && "-ml-1 rotate-180",
        arrow === "right" && "-mr-1"
      )}
    />
  );

  const content = (
    <>
      {arrow === "left" && arrowIcon}
      {children}
      {arrow === "right" && arrowIcon}
    </>
  );

  if (props.href !== undefined) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link className={combinedClassName} href={href} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { href: _, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={combinedClassName} {...buttonProps}>
      {content}
    </button>
  );
}
