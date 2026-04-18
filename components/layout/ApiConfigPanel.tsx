'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Wifi, WifiOff, FlaskConical, RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { useConfig } from '@/lib/config-context'
import { healthCheck } from '@/lib/api'

interface Props {
  onClose: () => void
}

type Status = 'idle' | 'checking' | 'ok' | 'error'

export function ApiConfigPanel({ onClose }: Props) {
  const { config, update } = useConfig()
  const [urlDraft, setUrlDraft] = useState(config.baseUrl)
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')

  // Auto-check on mount
  useEffect(() => {
    testConnection(config.baseUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function testConnection(url: string) {
    setStatus('checking')
    setStatusMsg('')
    try {
      await healthCheck(url)
      setStatus('ok')
      setStatusMsg('Connected successfully')
    } catch (err: unknown) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : 'Connection failed')
    }
  }

  function handleSave() {
    const trimmed = urlDraft.trim().replace(/\/$/, '')
    update({ baseUrl: trimmed })
    testConnection(trimmed)
  }

  return (
    <div className="absolute bottom-16 left-3 right-3 z-50 rounded-xl border border-bg-border bg-bg-card shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bg-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent-cyan" />
          <span className="text-sm font-semibold text-gray-200">API Configuration</span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-500 transition hover:bg-bg-elevated hover:text-gray-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        {/* API URL */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">
            Backend URL
          </label>
          <div className="flex gap-2">
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="http://localhost:8080"
              className="flex-1 h-8 rounded-lg border border-bg-border bg-bg-elevated px-3 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/20"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSave}
              loading={status === 'checking'}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Connection status */}
        <div
          className={clsx(
            'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs',
            status === 'ok'       && 'border-accent-green/20 bg-accent-green/5 text-accent-green',
            status === 'error'    && 'border-accent-red/20 bg-accent-red/5 text-accent-red',
            status === 'checking' && 'border-bg-border bg-bg-elevated text-gray-400',
            status === 'idle'     && 'border-bg-border bg-bg-elevated text-gray-600',
          )}
        >
          {status === 'checking' ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : status === 'ok' ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span>
            {status === 'checking' && 'Testing connection…'}
            {status === 'ok'       && statusMsg}
            {status === 'error'    && statusMsg}
            {status === 'idle'     && 'Not tested yet'}
          </span>
          {status !== 'checking' && (
            <button
              onClick={() => testConnection(config.baseUrl)}
              className="ml-auto underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>

        {/* Mock Mode toggle */}
        <div className="flex items-center justify-between rounded-lg border border-bg-border bg-bg-elevated px-3 py-3">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="h-4 w-4 text-accent-amber" />
            <div>
              <p className="text-xs font-medium text-gray-200">Mock Mode</p>
              <p className="text-[10px] text-gray-600">
                Use local sample data — no backend needed
              </p>
            </div>
          </div>
          <button
            onClick={() => update({ mockMode: !config.mockMode })}
            className={clsx(
              'relative h-5 w-9 rounded-full transition-colors',
              config.mockMode ? 'bg-accent-amber/50' : 'bg-bg-border',
            )}
          >
            <span
              className={clsx(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                config.mockMode ? 'translate-x-4' : 'translate-x-0.5',
              )}
            />
          </button>
        </div>

        {config.mockMode && (
          <p className="rounded-lg border border-accent-amber/20 bg-accent-amber/5 px-3 py-2 text-[11px] leading-relaxed text-accent-amber">
            Mock mode active — Query Playground and Dashboard will use local sample data.
            Real API calls are disabled.
          </p>
        )}
      </div>
    </div>
  )
}
