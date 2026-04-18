export interface ApiConfig {
  baseUrl: string
  mockMode: boolean
}

export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  mockMode: false,
}

const STORAGE_KEY = 'ce_api_config'

export function loadConfig(): ApiConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_CONFIG }
}

export function saveConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // ignore storage errors
  }
}
