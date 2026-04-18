'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { loadConfig, saveConfig, type ApiConfig } from './config'

interface ConfigContextValue {
  config: ApiConfig
  update: (patch: Partial<ApiConfig>) => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>(loadConfig)

  const update = useCallback((patch: Partial<ApiConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch }
      saveConfig(next)
      return next
    })
  }, [])

  return (
    <ConfigContext.Provider value={{ config, update }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig must be used inside ConfigProvider')
  return ctx
}
