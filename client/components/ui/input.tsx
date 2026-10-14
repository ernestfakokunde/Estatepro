import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  suffix?: ReactNode;
};

export function Input({ label, error, hint, suffix, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-ink">
        {label}
        {props.required && (
          <span aria-hidden="true" className="ml-1 text-rose-700">
            *
          </span>
        )}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'min-h-11 w-full rounded-sm border border-line bg-white px-3 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20',
            suffix && 'pr-16',
            error && 'border-rose-600 focus:border-rose-600 focus:ring-rose-100',
            className,
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={textareaId} className="text-xs font-semibold text-ink">
        {label}
        {props.required && (
          <span aria-hidden="true" className="ml-1 text-rose-700">
            *
          </span>
        )}
      </label>
      <textarea
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={cn(
          'min-h-28 w-full resize-y rounded-sm border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20',
          error && 'border-rose-600',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
