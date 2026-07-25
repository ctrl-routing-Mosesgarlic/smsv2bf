import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-border-focus ${
            error
              ? 'border-danger text-danger focus:border-danger'
              : 'border-border-default text-text-primary focus:border-border-focus'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {helpText && !error && (
          <p className="text-sm text-text-muted">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
