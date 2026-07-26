import { tv, type VariantProps } from "tailwind-variants";
import type { ButtonHTMLAttributes } from "react";
import Corner from "./Corner";

const button = tv({
  base: "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-border hover:bg-foreground/5",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={button({ variant, className })} {...props}>
      {variant === "outline" && (
        <>
          <Corner position="tl" size={6} />
          <Corner position="tr" size={6} />
          <Corner position="bl" size={6} />
          <Corner position="br" size={6} />
        </>
      )}
      {props.children}
    </button>
  );
}
