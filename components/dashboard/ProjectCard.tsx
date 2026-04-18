'use client'

import { FileCode2, FunctionSquare, Clock, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/lib/types'

interface Props {
  project: Project
  onClick?: () => void
}

const statusVariant = {
  active:   'green',
  indexing: 'amber',
  error:    'red',
} as const

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function ProjectCard({ project, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-bg-border bg-bg-card p-5 transition-all duration-200 hover:border-accent-cyan/30 hover:bg-bg-elevated"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-100 transition-colors group-hover:text-accent-cyan">
              {project.name}
            </h3>
            <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
          </div>
          <p className="mt-1 truncate font-mono text-xs text-gray-600">{project.path}</p>
        </div>
        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-gray-600 transition-colors group-hover:text-accent-cyan" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileCode2 className="h-3.5 w-3.5 text-accent-blue" />
          <span className="font-medium text-gray-300">{project.file_count}</span>
          <span>files</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FunctionSquare className="h-3.5 w-3.5 text-accent-purple" />
          <span className="font-medium text-gray-300">{project.func_count}</span>
          <span>functions</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-gray-600">
          <Clock className="h-3 w-3" />
          {timeAgo(project.created_at)}
        </div>
      </div>

      {project.status === 'indexing' && (
        <div className="mt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-bg-border">
            <div className="h-full w-3/5 rounded-full bg-accent-amber animate-pulse" />
          </div>
        </div>
      )}
    </div>
  )
}
