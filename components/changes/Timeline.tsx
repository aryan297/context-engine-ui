'use client'

import { clsx } from 'clsx'
import { Archive, GitMerge, RefreshCw, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { ChangeEvent } from '@/lib/types'

interface Props {
  events: ChangeEvent[]
  selected: string | null
  onSelect: (id: string) => void
}

const eventConfig = {
  ingest:  { icon: Archive,   variant: 'green' as const, dot: 'bg-accent-green' },
  update:  { icon: GitMerge,  variant: 'cyan'  as const, dot: 'bg-accent-cyan'  },
  delete:  { icon: Trash2,    variant: 'red'   as const, dot: 'bg-accent-red'   },
  reindex: { icon: RefreshCw, variant: 'amber' as const, dot: 'bg-accent-amber' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function Timeline({ events, selected, onSelect }: Props) {
  return (
    <div className="relative w-72 flex-shrink-0 overflow-y-auto border-r border-bg-border bg-bg-surface p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
        History — {events.length} events
      </h3>
      <div className="relative space-y-0">
        <div className="absolute bottom-2 left-3 top-2 w-px bg-bg-border" />
        {events.map((ev) => {
          const cfg = eventConfig[ev.type]
          const isSelected = selected === ev.id
          return (
            <button
              key={ev.id}
              onClick={() => onSelect(ev.id)}
              className={clsx(
                'relative w-full rounded-xl px-4 py-3 pl-9 text-left transition-all',
                isSelected
                  ? 'border border-accent-cyan/20 bg-bg-elevated'
                  : 'hover:bg-bg-elevated/50',
              )}
            >
              <span
                className={clsx(
                  'absolute left-2 top-4 h-2.5 w-2.5 rounded-full border-2 border-bg-surface',
                  cfg.dot,
                )}
              />
              <div className="flex items-center gap-2">
                <Badge variant={cfg.variant}>{ev.type}</Badge>
                <span className="text-xs text-gray-600">{ev.files_affected} files</span>
              </div>
              <p className="mt-1 text-xs font-medium text-gray-300">{ev.project_name}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">{ev.description}</p>
              <p className="mt-1 text-[10px] text-gray-700">{fmt(ev.timestamp)}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
