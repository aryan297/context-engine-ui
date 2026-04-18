import type { IngestResult, QueryResult } from './types'

const FALLBACK_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function request<T>(
  path: string,
  init: RequestInit,
  baseUrl: string = FALLBACK_BASE,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function healthCheck(baseUrl?: string): Promise<{ status: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`${baseUrl ?? FALLBACK_BASE}/health`, {
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

export async function ingestProject(
  projectName: string,
  path: string,
  baseUrl?: string,
): Promise<{ message: string; result: IngestResult }> {
  return request(
    '/v1/ingest-project',
    { method: 'POST', body: JSON.stringify({ project_name: projectName, path }) },
    baseUrl,
  )
}

export async function queryContext(
  projectName: string,
  query: string,
  baseUrl?: string,
): Promise<QueryResult> {
  return request(
    '/v1/query-context',
    { method: 'POST', body: JSON.stringify({ project_name: projectName, query }) },
    baseUrl,
  )
}
