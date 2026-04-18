import { X, FileCode2, FunctionSquare, Package, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { GraphNode } from '@/lib/types'

interface Props {
  node: GraphNode | null
  onClose: () => void
}

const typeConfig = {
  project:  { icon: Layers,         color: 'cyan'   as const, label: 'Project'  },
  file:     { icon: FileCode2,       color: 'blue'   as const, label: 'File'     },
  function: { icon: FunctionSquare,  color: 'purple' as const, label: 'Function' },
  import:   { icon: Package,         color: 'gray'   as const, label: 'Import'   },
}

export function NodePanel({ node, onClose }: Props) {
  if (!node) return null
  const cfg = typeConfig[node.type]
  const Icon = cfg.icon

  return (
    <div className="flex w-72 flex-shrink-0 flex-col border-l border-bg-border bg-bg-surface">
      <div className="flex items-center justify-between border-b border-bg-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 text-accent-${cfg.color}`} />
          <span className="text-sm font-semibold text-gray-200">Node Details</span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-500 transition-colors hover:bg-bg-elevated hover:text-gray-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div>
          <Badge variant={cfg.color}>{cfg.label}</Badge>
          <h3 className="mt-2 break-all text-base font-semibold text-gray-100">{node.label}</h3>
        </div>

        {node.path && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Path</p>
            <p className="mt-1 break-all rounded-lg bg-bg-elevated px-3 py-2 font-mono text-xs text-gray-400">
              {node.path}
            </p>
          </div>
        )}

        {node.signature && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Signature</p>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-bg-elevated px-3 py-2 font-mono text-xs text-accent-cyan">
              {node.signature}
            </pre>
          </div>
        )}

        {node.summary && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Summary</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{node.summary}</p>
          </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-600">Node ID</p>
          <p className="mt-1 break-all font-mono text-[10px] text-gray-600">{node.id}</p>
        </div>
      </div>
    </div>
  )
}
