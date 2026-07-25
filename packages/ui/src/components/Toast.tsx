'use client';

import { ReactNode, useEffect } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: ToastVariant;
  title?: string;
  children: ReactNode;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-white',
  info: 'bg-primary text-on-primary',
};

export function Toast({
  isOpen,
  onClose,
  variant = 'info',
  title,
  children,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-lg shadow-lg px-4 py-3 ${variantStyles[variant]}`}
      role="alert"
    >
      {title && <p className="font-semibold text-sm mb-1">{title}</p>}
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
}
