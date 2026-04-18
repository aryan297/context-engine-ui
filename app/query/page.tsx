'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Trash2, ChevronDown } from 'lucide-react'
import { Topbar } from '@/components/layout/Topbar'
import { MessageBubble } from '@/components/query/MessageBubble'
import { QueryInput } from '@/components/query/QueryInput'
import { Button } from '@/components/ui/Button'
import { MOCK_PROJECTS } from '@/lib/mock-data'
import { queryContext } from '@/lib/api'
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

    try {
      const result = await queryContext(project, text)
      const fileCount = (result.files?.length ?? 0) + (result.related_files?.length ?? 0)
      const fnCount = result.functions?.length ?? 0
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                loading: false,
                content: `Found ${fileCount} relevant file${fileCount !== 1 ? 's' : ''} and ${fnCount} function${fnCount !== 1 ? 's' : ''}.`,
                result,
              }
            : msg,
        ),
      )
    } catch (err: unknown) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                loading: false,
                content: `Error: ${err instanceof Error ? err.message : 'Query failed. Is the API server running?'}`,
              }
            : msg,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Topbar
        title="Query Playground"
        subtitle="Ask natural language questions about your codebase"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="h-8 appearance-none rounded-lg border border-bg-border bg-bg-elevated pl-3 pr-8 text-xs text-gray-200 outline-none focus:border-accent-cyan/50"
              >
                {MOCK_PROJECTS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
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
                  Ask natural language questions — the engine retrieves relevant context.
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
