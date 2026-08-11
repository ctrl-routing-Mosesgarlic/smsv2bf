"use client";

import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { ApiError } from "@/lib/api/errors";

export function ErrorAlert({ error }: { error: ApiError | string | null }) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
      <p className="font-medium">{message}</p>
      {typeof error !== "string" && Object.keys(error.fieldErrors ?? {}).length > 0 && (
        <ul className="mt-2 list-inside list-disc text-xs">
          {Object.entries(error.fieldErrors).map(([field, messages]) =>
            messages.map((m, i) => <li key={`${field}-${i}`}>{field}: {m}</li>)
          )}
        </ul>
      )}
    </div>
  );
}

export function SuccessAlert({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
      {children}
    </div>
  );
}

export function AuthCardShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer ? <div className="border-t px-6 py-4 text-center text-sm">{footer}</div> : null}
      </Card>
    </div>
  );
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof Input> & { label: string; error?: string }
>(function PasswordInput({ label, error, id, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          className="pr-9"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
});
