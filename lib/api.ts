import type { IngestResult, QueryResult } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function healthCheck(): Promise<{ status: string }> {
  return request('/health')
}

export async function ingestProject(
  projectName: string,
  path: string,
): Promise<{ message: string; result: IngestResult }> {
  return request('/v1/ingest-project', {
    method: 'POST',
    body: JSON.stringify({ project_name: projectName, path }),
  })
}

export async function queryContext(
  projectName: string,
  query: string,
): Promise<QueryResult> {
  return request('/v1/query-context', {
    method: 'POST',
    body: JSON.stringify({ project_name: projectName, query }),
  })
}
