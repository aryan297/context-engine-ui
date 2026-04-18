'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'
import { StatsGrid } from '@/components/dashboard/StatsGrid'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MOCK_PROJECTS, MOCK_CHANGE_EVENTS } from '@/lib/mock-data'
import { ingestProject } from '@/lib/api'
import { useConfig } from '@/lib/config-context'
import type { Project } from '@/lib/types'

export default function DashboardPage() {
  const { config } = useConfig()
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', path: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleIngest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (config.mockMode) {
      const newProject: Project = {
        id: `mock-${Date.now()}`,
        name: form.name,
        path: form.path,
        created_at: new Date().toISOString(),
        file_count: Math.floor(Math.random() * 30) + 5,
        func_count: Math.floor(Math.random() * 150) + 20,
        status: 'active',
      }
      setProjects((prev) => [newProject, ...prev])
      setShowModal(false)
      setForm({ name: '', path: '' })
      return
    }
    setLoading(true)
    try {
      const res = await ingestProject(form.name, form.path, config.baseUrl)
      const newProject: Project = {
        id: res.result.project_id,
        name: form.name,
        path: form.path,
        created_at: new Date().toISOString(),
        file_count: res.result.files_ingested,
        func_count: res.result.funcs_ingested,
        status: 'active',
      }
      setProjects((prev) => [newProject, ...prev])
      setShowModal(false)
      setForm({ name: '', path: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ingest failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Projects overview and system stats"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <Plus className="h-3.5 w-3.5" />
            Ingest Project
          </Button>
        }
      />

      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <StatsGrid projects={projects} />

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-600">
            Projects — {projects.length}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        <RecentActivity events={MOCK_CHANGE_EVENTS} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-bg-border bg-bg-card p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-100">Ingest New Project</h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Parse a Go codebase and store its context
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-bg-elevated hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleIngest} className="space-y-4">
              <Input
                label="Project Name"
                placeholder="e.g. AI-TMS"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Path"
                placeholder="e.g. /repos/my-project"
                value={form.path}
                onChange={(e) => setForm({ ...form, path: e.target.value })}
                required
              />
              {error && (
                <p className="rounded-lg border border-accent-red/20 bg-accent-red/5 px-3 py-2 text-xs text-accent-red">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={loading}>
                  Start Ingestion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
