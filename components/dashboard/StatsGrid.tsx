import { FileCode2, FunctionSquare, FolderGit2, Zap } from 'lucide-react'
import type { Project } from '@/lib/types'

interface Props {
  projects: Project[]
  cacheHitRate?: number
}

export function StatsGrid({ projects, cacheHitRate = 73 }: Props) {
  const totalFiles = projects.reduce((s, p) => s + p.file_count, 0)
  const totalFuncs = projects.reduce((s, p) => s + p.func_count, 0)

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderGit2,
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10',
      delta: '+1 this week',
    },
    {
      label: 'Total Files',
      value: totalFiles.toLocaleString(),
      icon: FileCode2,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
      delta: `${projects.filter((p) => p.status === 'active').length} active`,
    },
    {
      label: 'Total Functions',
      value: totalFuncs.toLocaleString(),
      icon: FunctionSquare,
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
      delta: 'indexed + embedded',
    },
    {
      label: 'Cache Hit Rate',
      value: `${cacheHitRate}%`,
      icon: Zap,
      color: 'text-accent-green',
      bg: 'bg-accent-green/10',
      delta: 'last 24h',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-bg-border bg-bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-gray-100">{s.value}</p>
              <p className="mt-1 text-xs text-gray-600">{s.delta}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
