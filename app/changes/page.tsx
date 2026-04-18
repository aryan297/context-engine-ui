'use client'

import { useState } from 'react'
import { Topbar } from '@/components/layout/Topbar'
import { Timeline } from '@/components/changes/Timeline'
import { DiffView } from '@/components/changes/DiffView'
import { MOCK_CHANGE_EVENTS } from '@/lib/mock-data'

export default function ChangesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_CHANGE_EVENTS[0]?.id ?? null,
  )

  const selected = MOCK_CHANGE_EVENTS.find((e) => e.id === selectedId)

  return (
    <>
      <Topbar title="Change Tracking" subtitle="Ingestion history and code diffs" />
      <div className="flex flex-1 overflow-hidden">
        <Timeline
          events={MOCK_CHANGE_EVENTS}
          selected={selectedId}
          onSelect={setSelectedId}
        />
        {selected ? (
          <DiffView
            diffs={selected.diff ?? []}
            projectName={selected.project_name}
            description={selected.description}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-600">
            Select an event to view its diff
          </div>
        )}
      </div>
    </>
  )
}
