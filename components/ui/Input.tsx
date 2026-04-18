'use client'

import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <input
        className={clsx(
          'h-9 w-full rounded-lg border border-bg-border bg-bg-elevated px-3 text-sm text-gray-200 placeholder:text-gray-600',
          'outline-none transition-all duration-150',
          'focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20',
          error && 'border-accent-red/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-gray-400">{label}</label>}
      <textarea
        className={clsx(
          'w-full resize-none rounded-lg border border-bg-border bg-bg-elevated px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600',
          'outline-none transition-all duration-150',
          'focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20',
          className,
        )}
        {...props}
      />
    </div>
  )
}
