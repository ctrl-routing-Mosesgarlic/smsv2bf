import { cn } from "../lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({ variant = "primary", className, ...props }: ButtonProps) {
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
