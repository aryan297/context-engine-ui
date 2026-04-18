'use client'

import { useEffect, useRef, useState } from 'react'
import cytoscape from 'cytoscape'
import { FileCode2, FunctionSquare } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { ServiceNode } from '@/lib/types'

interface Props {
  services: ServiceNode[]
}

const typeColors: Record<ServiceNode['type'], { bg: string; border: string; badge: string }> = {
  api:       { bg: '#22d3ee', border: '#06b6d4', badge: 'cyan'   },
  service:   { bg: '#3b82f6', border: '#2563eb', badge: 'blue'   },
  storage:   { bg: '#10b981', border: '#059669', badge: 'green'  },
  parser:    { bg: '#f59e0b', border: '#d97706', badge: 'amber'  },
  embedding: { bg: '#a855f7', border: '#9333ea', badge: 'purple' },
  cache:     { bg: '#ef4444', border: '#dc2626', badge: 'red'    },
}

type BadgeVariant = 'cyan' | 'blue' | 'green' | 'amber' | 'purple' | 'red' | 'gray'

export default function ServiceMap({ services }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<ServiceNode | null>(services[0] ?? null)

  useEffect(() => {
    if (!containerRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeStyles: any[] = services.map((s) => ({
      selector: `node[id="${s.id}"]`,
      style: {
        'background-color': typeColors[s.type].bg,
        'border-color': typeColors[s.type].border,
        'border-width': 2,
      },
    }))

    const elements: cytoscape.ElementDefinition[] = [
      ...services.map((s) => ({
        data: {
          id: s.id,
          label: s.name,
          type: s.type,
          file_count: s.file_count,
          func_count: s.func_count,
          description: s.description,
          depends_on: s.depends_on,
        },
      })),
      ...services.flatMap((s) =>
        s.depends_on.map((dep) => ({
          data: { id: `${s.id}->${dep}`, source: s.id, target: dep },
        })),
      ),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: [
        ...nodeStyles,
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            color: '#f9fafb',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '70px',
            width: 'mapData(func_count, 0, 10, 50, 100)',
            height: 'mapData(func_count, 0, 10, 50, 100)',
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#1e2a40',
            'target-arrow-color': '#1e2a40',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            width: 2,
            opacity: 0.7,
          },
        },
        {
          selector: 'node:selected',
          style: { 'border-color': '#f59e0b', 'border-width': 4 },
        },
      ] as any,
      minZoom: 0.3,
      maxZoom: 2.5,
    })

    // Run layout separately so we can stop it before destroy on unmount
    const layout = cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 500,
      nodeRepulsion: () => 20000,
      idealEdgeLength: () => 120,
      gravity: 0.2,
      fit: true,
      padding: 60,
    } as cytoscape.LayoutOptions)

    layout.run()

    cy.on('tap', 'node', (evt) => {
      const id = evt.target.id() as string
      const svc = services.find((s) => s.id === id)
      if (svc) setSelected(svc)
    })

    return () => {
      layout.stop()
      cy.destroy()
    }
  }, [services])

  const callers = selected
    ? services.filter((s) => s.depends_on.includes(selected.id))
    : []

  return (
    <div className="flex flex-1 overflow-hidden">
      <div ref={containerRef} className="cy-container flex-1" />

      {selected && (
        <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto border-l border-bg-border bg-bg-surface p-5">
          <div>
            <Badge variant={typeColors[selected.type].badge as BadgeVariant}>
              {selected.type}
            </Badge>
            <h3 className="mt-2 text-base font-bold text-gray-100">{selected.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{selected.description}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <FileCode2 className="h-3.5 w-3.5 text-accent-blue" />
              <span className="text-sm font-semibold text-gray-200">{selected.file_count}</span>
              <span className="text-xs text-gray-600">files</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FunctionSquare className="h-3.5 w-3.5 text-accent-purple" />
              <span className="text-sm font-semibold text-gray-200">{selected.func_count}</span>
              <span className="text-xs text-gray-600">functions</span>
            </div>
          </div>

          {selected.depends_on.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600">
                Depends On
              </p>
              <div className="space-y-1.5">
                {selected.depends_on.map((dep) => {
                  const depSvc = services.find((s) => s.id === dep)
                  if (!depSvc) return null
                  return (
                    <button
                      key={dep}
                      onClick={() => setSelected(depSvc)}
                      className="flex w-full items-center gap-2 rounded-lg border border-bg-border bg-bg-card px-3 py-2 transition-colors hover:border-accent-cyan/30"
                    >
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: typeColors[depSvc.type].bg }}
                      />
                      <span className="text-xs text-gray-300">{depSvc.name}</span>
                      <Badge
                        variant={typeColors[depSvc.type].badge as BadgeVariant}
                        className="ml-auto"
                      >
                        {depSvc.type}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {callers.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600">
                Used By
              </p>
              <div className="space-y-1.5">
                {callers.map((caller) => (
                  <button
                    key={caller.id}
                    onClick={() => setSelected(caller)}
                    className="flex w-full items-center gap-2 rounded-lg border border-bg-border bg-bg-card px-3 py-2 transition-colors hover:border-accent-cyan/30"
                  >
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: typeColors[caller.type].bg }}
                    />
                    <span className="text-xs text-gray-300">{caller.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
