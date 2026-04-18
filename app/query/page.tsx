'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Trash2, ChevronDown, FlaskConical, Wifi } from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'
import { MessageBubble } from '@/components/query/MessageBubble'
import { QueryInput } from '@/components/query/QueryInput'
import { Button } from '@/components/ui/Button'
import { MOCK_PROJECTS, mockQueryResult } from '@/lib/mock-data'
import { queryContext } from '@/lib/api'
import { useConfig } from '@/lib/config-context'
import type { ChatMessage } from '@/lib/types'

const SUGGESTIONS = [
  'How does project ingestion work?',
  'What functions handle embedding generation?',
  'How is the graph DB structured?',
  'Show me all query-related files',
]

let msgId = 0
const nextId = () => String(++msgId)

export default function QueryPage() {
  const { config } = useConfig()
  const [project, setProject] = useState(MOCK_PROJECTS[1].name)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendQuery(queryText: string = input) {
    const text = queryText.trim()
    if (!text || loading) return

    const loadingId = nextId()
    setMessages((m) => [
      ...m,
      { id: nextId(), role: 'user', content: text, timestamp: new Date() },
      { id: loadingId, role: 'assistant', content: '', timestamp: new Date(), loading: true },
    ])
    setInput('')
    setLoading(true)

    // Use mock data when mock mode is enabled
    if (config.mockMode) {
      await new Promise((r) => setTimeout(r, 600)) // simulate latency
      const result = mockQueryResult(text, project)
      const fileCount = result.files.length + result.related_files.length
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                loading: false,
                content: `[Mock] Found ${fileCount} file${fileCount !== 1 ? 's' : ''} and ${result.functions.length} function${result.functions.length !== 1 ? 's' : ''} for "${text}".`,
                result,
              }
            : msg,
        ),
      )
      setLoading(false)
      return
    }

    // Live API call with automatic mock fallback on failure
    try {
      const result = await queryContext(project, text, config.baseUrl)
      const fileCount = (result.files?.length ?? 0) + (result.related_files?.length ?? 0)
      const fnCount = result.functions?.length ?? 0
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                loading: false,
                content: `Found ${fileCount} relevant file${fileCount !== 1 ? 's' : ''} and ${fnCount} function${fnCount !== 1 ? 's' : ''} for "${text}".`,
                result,
              }
            : msg,
        ),
      )
    } catch {
      // API unreachable — fall back to mock with a notice
      const fallback = mockQueryResult(text, project)
      const fc = fallback.files.length + fallback.related_files.length
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                loading: false,
                content: `API unreachable — showing mock results. Found ${fc} file${fc !== 1 ? 's' : ''} and ${fallback.functions.length} function${fallback.functions.length !== 1 ? 's' : ''} for "${text}".`,
                result: fallback,
                fallback: true,
              }
            : msg,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const isMock = config.mockMode

  return (
    <>
      <Topbar
        title="Query Playground"
        subtitle="Ask natural language questions about your codebase"
        actions={
          <div className="flex items-center gap-2">
            {/* Mode badge */}
            <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
              isMock
                ? 'border-accent-amber/30 bg-accent-amber/10 text-accent-amber'
                : 'border-accent-green/30 bg-accent-green/10 text-accent-green'
            }`}>
              {isMock ? <FlaskConical className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
              {isMock ? 'Mock Mode' : 'Live API'}
            </div>

            {/* Project selector */}
            <div className="relative">
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="h-8 appearance-none rounded-lg border border-bg-border bg-bg-elevated pl-3 pr-8 text-xs text-gray-200 outline-none focus:border-accent-cyan/50"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([])}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-cyan/10">
                <MessageSquare className="h-6 w-6 text-accent-cyan" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-300">Query your codebase</p>
                <p className="mt-1 text-sm text-gray-600">
                  {isMock
                    ? 'Mock mode is on — results come from local sample data.'
                    : 'Results come from the Context Engine backend.'}
                </p>
                <p className="mt-0.5 text-xs text-gray-700">
                  Configure the API source via the{' '}
                  <span className="text-gray-500">⚙ gear icon</span> in the sidebar.
                </p>
              </div>
              <div className="grid max-w-md grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendQuery(s)}
                    className="rounded-xl border border-bg-border bg-bg-card px-4 py-3 text-left text-xs text-gray-400 transition-all hover:border-accent-cyan/30 hover:text-gray-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <QueryInput
          value={input}
          onChange={setInput}
          onSubmit={() => sendQuery()}
          loading={loading}
        />
      </div>
    </>
  )
}
