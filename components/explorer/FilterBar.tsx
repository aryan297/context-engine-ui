'use client'

import { clsx } from 'clsx'

interface Props {
  selectedProject: string
  projects: string[]
  showFunctions: boolean
  showImports: boolean
  onProjectChange: (p: string) => void
  onToggleFunctions: () => void
  onToggleImports: () => void
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        'relative h-4 w-7 rounded-full transition-colors',
        active ? 'bg-accent-cyan/40' : 'bg-bg-elevated',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform',
          active ? 'translate-x-3.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function FilterBar({
  selectedProject,
  projects,
  showFunctions,
  showImports,
  onProjectChange,
  onToggleFunctions,
  onToggleImports,
}: Props) {
  return (
    <div className="flex w-52 flex-shrink-0 flex-col gap-4 border-r border-bg-border bg-bg-surface p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">Project</p>
        <div className="space-y-1">
          {projects.map((p) => (
            <button
              key={p}
              onClick={() => onProjectChange(p)}
              className={clsx(
                'w-full rounded-lg px-3 py-2 text-left text-xs transition-all',
                selectedProject === p
                  ? 'bg-accent-cyan/10 font-medium text-accent-cyan'
                  : 'text-gray-500 hover:bg-bg-elevated hover:text-gray-300',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-bg-border" />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">Show Nodes</p>
        <div className="space-y-2">
          {[
            { label: 'Project',   color: 'bg-accent-cyan'   },
            { label: 'Files',     color: 'bg-accent-blue'   },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={clsx('h-2.5 w-2.5 rounded-full', color)} />
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-purple" />
              <span className="text-xs text-gray-400">Functions</span>
            </div>
            <Toggle active={showFunctions} onToggle={onToggleFunctions} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-600" />
              <span className="text-xs text-gray-400">Imports</span>
            </div>
            <Toggle active={showImports} onToggle={onToggleImports} />
          </div>
        </div>
      </div>

      <div className="h-px bg-bg-border" />

      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">Legend</p>
        {[
          { color: 'border-accent-cyan bg-accent-cyan/20',     label: 'CONTAINS' },
          { color: 'border-accent-purple bg-accent-purple/20', label: 'DEFINES'  },
          { color: 'border-gray-600 bg-transparent',           label: 'IMPORTS'  },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={clsx('h-0.5 w-5 rounded border', color)} />
            <span className="text-[10px] text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
