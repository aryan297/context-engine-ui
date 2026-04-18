'use client'

import dynamic from 'next/dynamic'
import { Topbar } from '@/components/layout/Topbar'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { MOCK_SERVICE_NODES } from '@/lib/mock-data'
import type { ServiceNode } from '@/lib/types'

const ServiceMap = dynamic(() => import('@/components/services/ServiceMap'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  ),
})

const TYPE_BADGE: Record<ServiceNode['type'], 'cyan' | 'blue' | 'green' | 'amber' | 'purple' | 'red'> = {
  api:       'cyan',
  service:   'blue',
  storage:   'green',
  parser:    'amber',
  embedding: 'purple',
  cache:     'red',
}

export default function ServicesPage() {
  const typeGroups = Object.entries(
    MOCK_SERVICE_NODES.reduce<Record<string, number>>((acc, s) => {
      acc[s.type] = (acc[s.type] ?? 0) + 1
      return acc
    }, {}),
  )

  return (
    <>
      <Topbar
        title="Services Map"
        subtitle="Context Engine internal architecture — dependency graph"
        actions={
          <div className="flex items-center gap-2">
            {typeGroups.map(([type, count]) => (
              <Badge key={type} variant={TYPE_BADGE[type as ServiceNode['type']]}>
                {count} {type}
              </Badge>
            ))}
          </div>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <ServiceMap services={MOCK_SERVICE_NODES} />
      </div>
    </>
  )
}
