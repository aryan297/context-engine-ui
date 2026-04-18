'use client'

import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import type { GraphNode, GraphEdge } from '@/lib/types'

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (node: GraphNode) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NODE_STYLES: any[] = [
  {
    selector: 'node[type="project"]',
    style: {
      'background-color': '#22d3ee',
      'border-color': '#06b6d4',
      'border-width': 2,
      label: 'data(label)',
      color: '#fff',
      'font-size': '13px',
      'font-weight': 'bold',
      'text-valign': 'center',
      'text-halign': 'center',
      'text-wrap': 'ellipsis',
      'text-max-width': '80px',
      width: 64,
      height: 64,
    },
  },
  {
    selector: 'node[type="file"]',
    style: {
      'background-color': '#3b82f6',
      'border-color': '#2563eb',
      'border-width': 1.5,
      label: 'data(label)',
      color: '#e2e8f0',
      'font-size': '10px',
      'text-valign': 'bottom',
      'text-margin-y': 4,
      'text-wrap': 'ellipsis',
      'text-max-width': '70px',
      width: 36,
      height: 36,
    },
  },
  {
    selector: 'node[type="function"]',
    style: {
      'background-color': '#a855f7',
      'border-color': '#9333ea',
      'border-width': 1,
      label: 'data(label)',
      color: '#d8b4fe',
      'font-size': '8px',
      'text-valign': 'bottom',
      'text-margin-y': 3,
      'text-wrap': 'ellipsis',
      'text-max-width': '55px',
      width: 22,
      height: 22,
    },
  },
  {
    selector: 'node[type="import"]',
    style: {
      'background-color': '#374151',
      'border-color': '#4b5563',
      'border-width': 1,
      label: 'data(label)',
      color: '#6b7280',
      'font-size': '7px',
      'text-valign': 'bottom',
      'text-margin-y': 2,
      'text-wrap': 'ellipsis',
      'text-max-width': '50px',
      width: 14,
      height: 14,
    },
  },
  {
    selector: 'edge',
    style: {
      'line-color': '#1e2a40',
      'target-arrow-color': '#1e2a40',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      width: 1.5,
      opacity: 0.6,
    },
  },
  {
    selector: 'edge[label="IMPORTS"]',
    style: {
      'line-style': 'dashed',
      'line-dash-pattern': [4, 3],
      opacity: 0.3,
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-color': '#f59e0b',
      'border-width': 3,
    },
  },
  {
    selector: 'node:active',
    style: { 'overlay-opacity': 0 },
  },
]

export default function GraphView({ nodes, edges, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const elements: cytoscape.ElementDefinition[] = [
      ...nodes.map(({ id, label, type, summary, path, signature }) => ({
        data: { id, label, type, summary, path, signature },
      })),
      ...edges.map((e) => ({
        data: { id: e.id, source: e.source, target: e.target, label: e.label },
      })),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: NODE_STYLES,
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 12000,
        idealEdgeLength: () => 80,
        gravity: 0.25,
        numIter: 500,
        fit: true,
        padding: 40,
      } as cytoscape.LayoutOptions,
      minZoom: 0.2,
      maxZoom: 3,
    })

    cy.on('tap', 'node', (evt) => {
      const nodeData = evt.target.data() as GraphNode
      onNodeClick?.(nodeData)
    })

    return () => cy.destroy()
  }, [nodes, edges, onNodeClick])

  return <div ref={containerRef} className="cy-container h-full w-full rounded-xl" />
}
