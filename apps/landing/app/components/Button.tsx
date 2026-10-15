import Link from "next/link";
import { tv, type VariantProps } from "tailwind-variants";
import type { ButtonHTMLAttributes } from "react";
import Corner from "./Corner";

const button = tv({
  base: "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-border hover:bg-foreground/5",
      ghost: "hover:bg-foreground/5",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & { href?: string };

export default function Button({ variant = "primary", className, href, children, ...props }: ButtonProps) {
  const classes = button({ variant, className });
  const content = (
    <>
      {variant === "outline" && <Corner corners="all" size={6} />}
      {children}
    </>
  );

  if (href) {
    const external = /^https?:\/\//.test(href);
    return external ? (
      <a href={href} className={classes}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
