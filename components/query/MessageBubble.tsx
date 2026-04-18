import { FileCode2, FunctionSquare, Network } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { LoadingDots } from '@/components/ui/Spinner'
import type { ChatMessage } from '@/lib/types'

interface Props {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-lg rounded-2xl rounded-tr-sm border border-accent-cyan/20 bg-accent-cyan/10 px-4 py-3">
          <p className="text-sm text-gray-100">{message.content}</p>
        </div>
      </div>
    )
  }

  if (message.loading) {
    return (
      <div className="flex gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-cyan/10">
          <span className="text-[10px] font-bold text-accent-cyan">CE</span>
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-bg-border bg-bg-card px-4 py-3">
          <LoadingDots />
        </div>
      </div>
    )
  }

  const result = message.result

  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-cyan/10">
        <span className="text-[10px] font-bold text-accent-cyan">CE</span>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="rounded-2xl rounded-tl-sm border border-bg-border bg-bg-card px-4 py-3">
          <p className="text-sm text-gray-300">{message.content}</p>
        </div>

        {result && (
          <div className="space-y-2">
            {(result.files?.length ?? 0) > 0 && (
              <div className="overflow-hidden rounded-xl border border-bg-border bg-bg-card">
                <div className="flex items-center gap-2 border-b border-bg-border bg-bg-elevated px-4 py-2">
                  <FileCode2 className="h-3.5 w-3.5 text-accent-blue" />
                  <span className="text-xs font-medium text-gray-300">Relevant Files</span>
                  <Badge variant="blue">{result.files.length}</Badge>
                </div>
                <div className="divide-y divide-bg-border">
                  {result.files.map((f) => (
                    <div key={f.id} className="px-4 py-2.5 transition-colors hover:bg-bg-elevated">
                      <p className="text-xs font-medium text-gray-200">{f.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-gray-600">{f.path}</p>
                      <p className="mt-0.5 text-[11px] text-gray-500">{f.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(result.functions?.length ?? 0) > 0 && (
              <div className="overflow-hidden rounded-xl border border-bg-border bg-bg-card">
                <div className="flex items-center gap-2 border-b border-bg-border bg-bg-elevated px-4 py-2">
                  <FunctionSquare className="h-3.5 w-3.5 text-accent-purple" />
                  <span className="text-xs font-medium text-gray-300">Relevant Functions</span>
                  <Badge variant="purple">{result.functions.length}</Badge>
                </div>
                <div className="divide-y divide-bg-border">
                  {result.functions.map((fn) => (
                    <div key={fn.id} className="px-4 py-2.5 transition-colors hover:bg-bg-elevated">
                      <p className="text-xs font-medium text-accent-purple">{fn.name}</p>
                      <pre className="mt-0.5 whitespace-pre-wrap font-mono text-[10px] text-gray-500">
                        {fn.signature}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(result.related_files?.length ?? 0) > 0 && (
              <div className="overflow-hidden rounded-xl border border-bg-border bg-bg-card">
                <div className="flex items-center gap-2 border-b border-bg-border bg-bg-elevated px-4 py-2">
                  <Network className="h-3.5 w-3.5 text-accent-cyan" />
                  <span className="text-xs font-medium text-gray-300">Graph-Expanded Context</span>
                  <Badge variant="cyan">{result.related_files.length}</Badge>
                </div>
                <div className="divide-y divide-bg-border">
                  {result.related_files.map((f) => (
                    <div key={f.id} className="px-4 py-2.5">
                      <p className="text-xs text-gray-400">{f.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
