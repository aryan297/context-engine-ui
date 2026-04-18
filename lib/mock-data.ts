import type { Project, ChangeEvent, ServiceNode, GraphNode, GraphEdge, FileNode, QueryResult } from './types'

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'AI-TMS',
    path: '/repos/ai-tms',
    created_at: '2026-04-15T09:00:00Z',
    file_count: 42,
    func_count: 318,
    status: 'active',
  },
  {
    id: 'p2',
    name: 'context-engine',
    path: '/repos/context-engine',
    created_at: '2026-04-17T14:30:00Z',
    file_count: 18,
    func_count: 76,
    status: 'active',
  },
  {
    id: 'p3',
    name: 'payment-service',
    path: '/repos/payment-service',
    created_at: '2026-04-10T11:15:00Z',
    file_count: 27,
    func_count: 194,
    status: 'active',
  },
  {
    id: 'p4',
    name: 'auth-gateway',
    path: '/repos/auth-gateway',
    created_at: '2026-04-18T08:00:00Z',
    file_count: 14,
    func_count: 88,
    status: 'indexing',
  },
]

export const MOCK_CHANGE_EVENTS: ChangeEvent[] = [
  {
    id: 'c1',
    type: 'ingest',
    project_name: 'auth-gateway',
    description: 'Initial project ingestion',
    files_affected: 14,
    timestamp: '2026-04-18T08:02:11Z',
    diff: [
      {
        file_name: 'middleware.go',
        before: [],
        after: [
          'package middleware',
          '',
          'import "github.com/gin-gonic/gin"',
          '',
          'func JWTAuth() gin.HandlerFunc {',
          '    return func(c *gin.Context) {',
          '        token := c.GetHeader("Authorization")',
          '        // validate token',
          '        c.Next()',
          '    }',
          '}',
        ],
      },
    ],
  },
  {
    id: 'c2',
    type: 'update',
    project_name: 'AI-TMS',
    description: '3 files modified after reparse',
    files_affected: 3,
    timestamp: '2026-04-17T22:45:00Z',
    diff: [
      {
        file_name: 'tat_calculator.go',
        before: [
          'func CalculateTAT(order Order) time.Duration {',
          '    return order.Deadline.Sub(order.CreatedAt)',
          '}',
        ],
        after: [
          'func CalculateTAT(order Order, calendar BusinessCalendar) time.Duration {',
          '    working := calendar.WorkingHours(order.CreatedAt, order.Deadline)',
          '    return working',
          '}',
        ],
      },
    ],
  },
  {
    id: 'c3',
    type: 'reindex',
    project_name: 'context-engine',
    description: 'Full embedding re-generation triggered',
    files_affected: 18,
    timestamp: '2026-04-17T14:35:00Z',
  },
  {
    id: 'c4',
    type: 'ingest',
    project_name: 'payment-service',
    description: 'Initial project ingestion',
    files_affected: 27,
    timestamp: '2026-04-10T11:18:22Z',
  },
]

export const MOCK_SERVICE_NODES: ServiceNode[] = [
  {
    id: 's-api',
    name: 'API Layer',
    type: 'api',
    description: 'Gin HTTP handlers — ingest + query endpoints',
    file_count: 3,
    func_count: 8,
    depends_on: ['s-ingest', 's-query'],
  },
  {
    id: 's-ingest',
    name: 'Ingest Service',
    type: 'service',
    description: 'Orchestrates parsing, embedding generation, and storage',
    file_count: 1,
    func_count: 4,
    depends_on: ['s-parser', 's-embed', 's-pg', 's-neo4j'],
  },
  {
    id: 's-query',
    name: 'Query Service',
    type: 'service',
    description: 'Converts queries to embeddings, vector searches, graph expansion',
    file_count: 1,
    func_count: 3,
    depends_on: ['s-embed', 's-pg', 's-neo4j', 's-redis'],
  },
  {
    id: 's-parser',
    name: 'Go Parser',
    type: 'parser',
    description: 'AST-based Go source parser — extracts files, functions, imports',
    file_count: 1,
    func_count: 5,
    depends_on: [],
  },
  {
    id: 's-embed',
    name: 'Embedder',
    type: 'embedding',
    description: 'Generates vector embeddings (mock → real API)',
    file_count: 1,
    func_count: 2,
    depends_on: [],
  },
  {
    id: 's-pg',
    name: 'Postgres / pgvector',
    type: 'storage',
    description: 'Stores file + function embeddings, cosine similarity search',
    file_count: 1,
    func_count: 6,
    depends_on: [],
  },
  {
    id: 's-neo4j',
    name: 'Neo4j',
    type: 'storage',
    description: 'Graph of Project → File → Function → Import relationships',
    file_count: 1,
    func_count: 5,
    depends_on: [],
  },
  {
    id: 's-redis',
    name: 'Redis Cache',
    type: 'cache',
    description: 'TTL-based cache for query results (10 min)',
    file_count: 1,
    func_count: 3,
    depends_on: [],
  },
]

export const MOCK_FILES: FileNode[] = [
  {
    id: 'f1',
    project_id: 'p2',
    project_name: 'context-engine',
    name: 'ingest_service.go',
    path: 'internal/service/ingest_service.go',
    imports: [
      'github.com/google/uuid',
      'go.uber.org/zap',
      'github.com/context-engine/internal/domain/model',
    ],
    summary: 'Go file ingest_service.go with 4 functions and 5 imports',
    functions: [
      {
        id: 'fn1',
        file_id: 'f1',
        project_name: 'context-engine',
        name: 'NewIngestService',
        signature: 'func NewIngestService(...) *IngestService',
        summary: 'Function NewIngestService in ingest_service.go',
      },
      {
        id: 'fn2',
        file_id: 'f1',
        project_name: 'context-engine',
        name: 'IngestProject',
        signature: 'func (s) IngestProject(...) (*IngestResult, error)',
        summary: 'Function IngestProject in ingest_service.go',
      },
    ],
  },
  {
    id: 'f2',
    project_id: 'p2',
    project_name: 'context-engine',
    name: 'query_service.go',
    path: 'internal/service/query_service.go',
    imports: ['encoding/json', 'fmt', 'time'],
    summary: 'Go file query_service.go with 3 functions and 4 imports',
    functions: [
      {
        id: 'fn3',
        file_id: 'f2',
        project_name: 'context-engine',
        name: 'NewQueryService',
        signature: 'func NewQueryService(...) *QueryService',
        summary: 'Function NewQueryService in query_service.go',
      },
      {
        id: 'fn4',
        file_id: 'f2',
        project_name: 'context-engine',
        name: 'QueryContext',
        signature: 'func (s) QueryContext(...) (*QueryResult, error)',
        summary: 'Function QueryContext in query_service.go',
      },
    ],
  },
  {
    id: 'f3',
    project_id: 'p2',
    project_name: 'context-engine',
    name: 'go_parser.go',
    path: 'internal/parser/go_parser.go',
    imports: ['go/ast', 'go/parser', 'go/token', 'path/filepath'],
    summary: 'Go file go_parser.go with 5 functions and 6 imports',
    functions: [
      {
        id: 'fn5',
        file_id: 'f3',
        project_name: 'context-engine',
        name: 'ParseDirectory',
        signature: 'func (p) ParseDirectory(...) ([]*model.File, error)',
        summary: 'Function ParseDirectory in go_parser.go',
      },
      {
        id: 'fn6',
        file_id: 'f3',
        project_name: 'context-engine',
        name: 'ParseFile',
        signature: 'func (p) ParseFile(...) (*model.File, error)',
        summary: 'Function ParseFile in go_parser.go',
      },
      {
        id: 'fn7',
        file_id: 'f3',
        project_name: 'context-engine',
        name: 'buildSignature',
        signature: 'func buildSignature(fn *ast.FuncDecl) string',
        summary: 'Function buildSignature in go_parser.go',
      },
    ],
  },
  {
    id: 'f4',
    project_id: 'p2',
    project_name: 'context-engine',
    name: 'mock_embedding.go',
    path: 'internal/embedding/mock_embedding.go',
    imports: ['math', 'math/rand', 'time'],
    summary: 'Go file mock_embedding.go with 2 functions and 3 imports',
    functions: [
      {
        id: 'fn8',
        file_id: 'f4',
        project_name: 'context-engine',
        name: 'NewMockEmbedder',
        signature: 'func NewMockEmbedder() *MockEmbedder',
        summary: 'Function NewMockEmbedder in mock_embedding.go',
      },
      {
        id: 'fn9',
        file_id: 'f4',
        project_name: 'context-engine',
        name: 'Generate',
        signature: 'func (e) Generate(_ string) []float32',
        summary: 'Function Generate in mock_embedding.go',
      },
    ],
  },
]

export function buildGraphElements(
  files: FileNode[],
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const seen = new Set<string>()

  if (files.length === 0) return { nodes, edges }

  const projectName = files[0].project_name
  const projectId = `proj-${projectName}`
  nodes.push({
    id: projectId,
    label: projectName,
    type: 'project',
    summary: `Project: ${projectName}`,
  })

  for (const file of files) {
    nodes.push({
      id: file.id,
      label: file.name,
      type: 'file',
      summary: file.summary,
      path: file.path,
    })
    edges.push({
      id: `e-${projectId}-${file.id}`,
      source: projectId,
      target: file.id,
      label: 'CONTAINS',
    })

    for (const fn of file.functions) {
      nodes.push({
        id: fn.id,
        label: fn.name,
        type: 'function',
        summary: fn.summary,
        signature: fn.signature,
      })
      edges.push({
        id: `e-${file.id}-${fn.id}`,
        source: file.id,
        target: fn.id,
        label: 'DEFINES',
      })
    }

    for (const imp of file.imports ?? []) {
      const impId = `imp-${imp}`
      if (!seen.has(impId)) {
        nodes.push({
          id: impId,
          label: imp.split('/').pop() ?? imp,
          type: 'import',
          path: imp,
        })
        seen.add(impId)
      }
      edges.push({
        id: `e-${file.id}-${impId}`,
        source: file.id,
        target: impId,
        label: 'IMPORTS',
      })
    }
  }

  return { nodes, edges }
}

/**
 * Returns mock query results by keyword-matching query terms against
 * file/function summaries. Used when API is offline or mock mode is on.
 */
export function mockQueryResult(query: string, projectName: string): QueryResult {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)

  function score(text: string): number {
    const t = text.toLowerCase()
    return terms.reduce((n, term) => n + (t.includes(term) ? 1 : 0), 0)
  }

  const projectFiles = MOCK_FILES.filter((f) => f.project_name === projectName)
  const allFiles = projectFiles.length > 0 ? projectFiles : MOCK_FILES

  const rankedFiles = allFiles
    .map((f) => ({ f, s: score(f.name + ' ' + f.summary) }))
    .sort((a, b) => b.s - a.s)

  const topFiles = rankedFiles.slice(0, 3).map((r) => r.f)
  const related = rankedFiles.slice(3, 5).map((r) => r.f)

  const allFunctions = allFiles.flatMap((f) => f.functions)
  const topFunctions = allFunctions
    .map((fn) => ({ fn, s: score(fn.name + ' ' + fn.summary + ' ' + fn.signature) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 6)
    .map((r) => r.fn)

  return {
    query,
    files: topFiles,
    functions: topFunctions,
    related_files: related,
  }
}
