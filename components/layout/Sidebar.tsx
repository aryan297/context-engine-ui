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
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { healthCheck } from '@/lib/api'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/explorer',  label: 'Context Explorer', icon: Network         },
  { href: '/query',     label: 'Query Playground', icon: MessageSquare   },
  { href: '/changes',   label: 'Change Tracking',  icon: GitCommit       },
  { href: '/services',  label: 'Services Map',      icon: Layers          },
]

export function Sidebar() {
  const pathname = usePathname()
  const [apiOk, setApiOk] = useState<boolean | null>(null)

  useEffect(() => {
    healthCheck()
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false))
  }, [])

  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col border-r border-bg-border bg-bg-surface">
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
                  ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                  : 'text-gray-500 hover:bg-bg-elevated hover:text-gray-300',
              )}
            >
              <Icon className={clsx('h-4 w-4 flex-shrink-0', active ? 'text-accent-cyan' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* API status */}
      <div className="mx-4 mb-5 mt-auto rounded-lg border border-bg-border bg-bg-card p-3">
        <div className="flex items-center gap-2">
          <Circle
            className={clsx(
              'h-2 w-2 fill-current',
              apiOk === null
                ? 'text-gray-500'
                : apiOk
                ? 'text-accent-green'
                : 'text-accent-red',
            )}
          />
          <span className="text-xs text-gray-400">
            {apiOk === null ? 'Checking API…' : apiOk ? 'API Connected' : 'API Offline'}
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] text-gray-600">localhost:8080</p>
      </div>
    </aside>
  )
}
