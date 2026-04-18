export interface Project {
  id: string
  name: string
  path: string
  created_at: string
  file_count: number
  func_count: number
  status: 'active' | 'indexing' | 'error'
}

export interface FileNode {
  id: string
  project_id: string
  project_name: string
  name: string
  path: string
  imports: string[]
  summary: string
  functions: FunctionNode[]
}

export interface FunctionNode {
  id: string
  file_id: string
  project_name: string
  name: string
  signature: string
  summary: string
}

export interface QueryResult {
  query: string
  files: FileNode[]
  functions: FunctionNode[]
  related_files: FileNode[]
}

export interface IngestResult {
  project_id: string
  files_ingested: number
  funcs_ingested: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: QueryResult
  timestamp: Date
  loading?: boolean
}

export interface ChangeEvent {
  id: string
  type: 'ingest' | 'update' | 'delete' | 'reindex'
  project_name: string
  description: string
  files_affected: number
  timestamp: string
  diff?: FileDiff[]
}

export interface FileDiff {
  file_name: string
  before: string[]
  after: string[]
}

export interface ServiceNode {
  id: string
  name: string
  type: 'api' | 'service' | 'storage' | 'parser' | 'embedding' | 'cache'
  description: string
  file_count: number
  func_count: number
  depends_on: string[]
}

export interface GraphNode {
  id: string
  label: string
  type: 'project' | 'file' | 'function' | 'import'
  summary?: string
  path?: string
  signature?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
}
