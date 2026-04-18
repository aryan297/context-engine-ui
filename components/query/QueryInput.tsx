'use client'

import { useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  loading: boolean
  disabled?: boolean
}

export function QueryInput({ value, onChange, onSubmit, loading, disabled }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-bg-border bg-bg-surface px-4 py-3">
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled || loading}
        placeholder="Ask about the codebase… (Enter to send, Shift+Enter for newline)"
        className={clsx(
          'flex-1 resize-none rounded-xl border border-bg-border bg-bg-elevated px-4 py-2.5',
          'text-sm text-gray-200 placeholder:text-gray-600',
          'max-h-32 overflow-y-auto outline-none transition-all',
          'focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20',
          'disabled:opacity-50',
        )}
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim() || loading || disabled}
        className={clsx(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all',
          value.trim() && !loading && !disabled
            ? 'bg-accent-cyan text-bg-base hover:bg-cyan-300'
            : 'cursor-not-allowed bg-bg-elevated text-gray-600',
        )}
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}
