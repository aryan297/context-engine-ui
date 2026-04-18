'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Topbar } from '@/components/layout/Topbar'
import { FilterBar } from '@/components/explorer/FilterBar'
import { NodePanel } from '@/components/explorer/NodePanel'
import { Spinner } from '@/components/ui/Spinner'
import { MOCK_FILES, MOCK_PROJECTS, buildGraphElements } from '@/lib/mock-data'
import type { GraphNode } from '@/lib/types'

const GraphView = dynamic(() => import('@/components/explorer/GraphView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
})

export default function ExplorerPage() {
  const projectNames = MOCK_PROJECTS.map((p) => p.name)
  const [selectedProject, setSelectedProject] = useState(projectNames[1])
  const [showFunctions, setShowFunctions] = useState(true)
  const [showImports, setShowImports] = useState(false)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)

  const { nodes, edges } = useMemo(() => {
    const files = MOCK_FILES.filter((f) => f.project_name === selectedProject)
    const { nodes: allNodes, edges: allEdges } = buildGraphElements(files)
    const filtered = allNodes.filter((n) => {
      if (n.type === 'function' && !showFunctions) return false
      if (n.type === 'import' && !showImports) return false
      return true
    })
    const visibleIds = new Set(filtered.map((n) => n.id))
    return {
      nodes: filtered,
      edges: allEdges.filter((e) => visibleIds.has(e.source) && visibleIds.has(e.target)),
    }
  }, [selectedProject, showFunctions, showImports])

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
  }, [])

  return (
    <>
      <Topbar
        title="Context Explorer"
        subtitle={`${nodes.length} nodes · ${edges.length} edges — ${selectedProject}`}
      />
      <div className="flex flex-1 overflow-hidden">
        <FilterBar
          selectedProject={selectedProject}
          projects={projectNames}
          showFunctions={showFunctions}
          showImports={showImports}
          onProjectChange={(p) => { setSelectedProject(p); setSelectedNode(null) }}
          onToggleFunctions={() => setShowFunctions((v) => !v)}
          onToggleImports={() => setShowImports((v) => !v)}
        />

        <div className="relative flex-1 overflow-hidden p-4">
          {nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-600">
              No graph data for{' '}
              <span className="ml-1 text-gray-400">{selectedProject}</span>
            </div>
          ) : (
            <GraphView nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
          )}

          <div className="pointer-events-none absolute bottom-6 left-6 flex gap-2">
            {[
              { color: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',     label: `${nodes.filter((n) => n.type === 'project').length} project`   },
              { color: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',     label: `${nodes.filter((n) => n.type === 'file').length} files`         },
              { color: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30', label: `${nodes.filter((n) => n.type === 'function').length} functions` },
            ].map(({ color, label }) => (
              <span
                key={label}
                className={`rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${color}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>
    </>
  )
}
