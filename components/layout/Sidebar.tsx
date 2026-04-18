'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Network,
  MessageSquare,
  GitCommit,
  Layers,
  Zap,
  Circle,
  Settings2,
  FlaskConical,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { healthCheck } from '@/lib/api'
import { useConfig } from '@/lib/config-context'
import { ApiConfigPanel } from './ApiConfigPanel'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',        icon: LayoutDashboard },
  { href: '/explorer',  label: 'Context Explorer', icon: Network         },
  { href: '/query',     label: 'Query Playground', icon: MessageSquare   },
  { href: '/changes',   label: 'Change Tracking',  icon: GitCommit       },
  { href: '/services',  label: 'Services Map',      icon: Layers          },
]

export function Sidebar() {
  const pathname = usePathname()
  const { config } = useConfig()
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [showConfig, setShowConfig] = useState(false)

  useEffect(() => {
    if (config.mockMode) {
      setApiOk(null)
      return
    }
    setApiOk(null)
    healthCheck(config.baseUrl)
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false))
  }, [config.baseUrl, config.mockMode])

  return (
    <aside className="relative flex h-screen w-56 flex-shrink-0 flex-col border-r border-bg-border bg-bg-surface">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cyan/10">
          <Zap className="h-4 w-4 text-accent-cyan" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-100">Context</p>
          <p className="text-[10px] font-medium leading-none text-accent-cyan">ENGINE</p>
        </div>
      </div>

      <div className="mx-4 h-px bg-bg-border" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150',
                active
                  ? 'bg-accent-cyan/10 font-medium text-accent-cyan'
                  : 'text-gray-500 hover:bg-bg-elevated hover:text-gray-300',
              )}
            >
              <Icon className={clsx('h-4 w-4 flex-shrink-0', active ? 'text-accent-cyan' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Config panel (renders above the status bar) */}
      {showConfig && <ApiConfigPanel onClose={() => setShowConfig(false)} />}

      {/* API status + config button */}
      <div className="mx-4 mb-5 space-y-2">
        {/* Mock mode badge */}
        {config.mockMode && (
          <div className="flex items-center gap-1.5 rounded-lg border border-accent-amber/20 bg-accent-amber/5 px-3 py-1.5">
            <FlaskConical className="h-3 w-3 text-accent-amber" />
            <span className="text-[10px] font-medium text-accent-amber">Mock Mode On</span>
          </div>
        )}

        <div className="rounded-lg border border-bg-border bg-bg-card p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle
                className={clsx(
                  'h-2 w-2 fill-current',
                  config.mockMode
                    ? 'text-accent-amber'
                    : apiOk === null
                    ? 'text-gray-600'
                    : apiOk
                    ? 'text-accent-green'
                    : 'text-accent-red',
                )}
              />
              <span className="text-xs text-gray-400">
                {config.mockMode
                  ? 'Mock Data'
                  : apiOk === null
                  ? 'Checking…'
                  : apiOk
                  ? 'API Connected'
                  : 'API Offline'}
              </span>
            </div>
            <button
              onClick={() => setShowConfig((v) => !v)}
              className={clsx(
                'rounded-md p-1 transition-colors',
                showConfig
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-gray-600 hover:bg-bg-elevated hover:text-gray-300',
              )}
              title="Configure API"
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-gray-600">
            {config.mockMode ? 'local mock data' : config.baseUrl}
          </p>
        </div>
      </div>
    </aside>
  )
}
