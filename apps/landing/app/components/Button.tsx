import { cn } from "../lib/utils";
import type { ButtonHTMLAttributes } from "react";
import Corner from "./Corner";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
  if (variant === "outline") {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer border border-border hover:bg-foreground/5",
          className,
        )}
        {...props}
      >
        <Corner position="tl" size={6} />
        <Corner position="tr" size={6} />
        <Corner position="bl" size={6} />
        <Corner position="br" size={6} />
        {props.children}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors cursor-pointer",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
          "text-foreground hover:bg-foreground/5": variant === "ghost",
        },
        className,
      )}
      {...props}
    />
  );
}
