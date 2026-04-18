'use client'

import { Bell, Settings } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-bg-border bg-bg-surface/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-sm font-semibold text-gray-100">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-bg-elevated hover:text-gray-300">
          <Bell className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-bg-elevated hover:text-gray-300">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
