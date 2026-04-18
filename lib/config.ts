export interface ApiConfig {
  baseUrl: string
  mockMode: boolean
}

export const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  mockMode: false,
}

const STORAGE_KEY = 'ce_api_config'

export function loadConfig(): ApiConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<ApiConfig>
      // migrate: drop hardcoded localhost URL so proxy is used
      if (saved.baseUrl === 'http://localhost:8080') saved.baseUrl = ''
      return { ...DEFAULT_CONFIG, ...saved }
    }
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
