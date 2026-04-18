import { GitMerge, RefreshCw, Trash2, Archive } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { ChangeEvent } from '@/lib/types'

interface Props {
  events: ChangeEvent[]
}

const eventConfig = {
  ingest:  { icon: Archive,   label: 'Ingest',  variant: 'green' as const },
  update:  { icon: GitMerge,  label: 'Update',  variant: 'cyan'  as const },
  delete:  { icon: Trash2,    label: 'Delete',  variant: 'red'   as const },
  reindex: { icon: RefreshCw, label: 'Reindex', variant: 'amber' as const },
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export function RecentActivity({ events }: Props) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-card">
      <div className="border-b border-bg-border px-5 py-4">
        <h3 className="text-sm font-semibold text-gray-200">Recent Activity</h3>
      </div>
      <div className="divide-y divide-bg-border">
        {events.map((event) => {
          const cfg = eventConfig[event.type]
          const Icon = cfg.icon
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-bg-elevated"
            >
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-bg-elevated">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">{event.project_name}</span>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  <span className="text-xs text-gray-600">{event.files_affected} files</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{event.description}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-600">{fmt(event.timestamp)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
