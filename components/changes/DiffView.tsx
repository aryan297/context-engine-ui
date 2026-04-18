import { FileCode2, Plus, Minus, Equal } from 'lucide-react'
import type { FileDiff } from '@/lib/types'

interface Props {
  diffs: FileDiff[]
  projectName: string
  description: string
}

type DiffLine = { type: 'add' | 'remove' | 'equal'; text: string }

function diffLines(before: string[], after: string[]): DiffLine[] {
  const result: DiffLine[] = []
  if (before.length === 0) {
    after.forEach((text) => result.push({ type: 'add', text }))
    return result
  }
  const maxLen = Math.max(before.length, after.length)
  for (let i = 0; i < maxLen; i++) {
    const b = before[i]
    const a = after[i]
    if (b === undefined) {
      result.push({ type: 'add', text: a })
    } else if (a === undefined) {
      result.push({ type: 'remove', text: b })
    } else if (b === a) {
      result.push({ type: 'equal', text: b })
    } else {
      result.push({ type: 'remove', text: b })
      result.push({ type: 'add', text: a })
    }
  }
  return result
}

export function DiffView({ diffs, projectName, description }: Props) {
  const additions = diffs.reduce((n, d) => n + d.after.length, 0)
  const deletions = diffs.reduce((n, d) => n + d.before.length, 0)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-bg-border bg-bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-200">{projectName}</h3>
          <span className="text-xs text-gray-500">{description}</span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-accent-green">
            <Plus className="h-3 w-3" />
            {additions} additions
          </span>
          <span className="flex items-center gap-1 text-accent-red">
            <Minus className="h-3 w-3" />
            {deletions} deletions
          </span>
          <span className="text-gray-600">
            {diffs.length} file{diffs.length !== 1 ? 's' : ''} changed
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {diffs.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-gray-600">
            No diff data for this event
          </div>
        ) : (
          diffs.map((diff) => {
            const lines = diffLines(diff.before, diff.after)
            return (
              <div key={diff.file_name} className="overflow-hidden rounded-xl border border-bg-border">
                <div className="flex items-center gap-2 border-b border-bg-border bg-bg-elevated px-4 py-2.5">
                  <FileCode2 className="h-3.5 w-3.5 text-accent-blue" />
                  <span className="font-mono text-xs text-gray-300">{diff.file_name}</span>
                </div>
                <div className="overflow-x-auto bg-bg-card">
                  <table className="w-full font-mono text-xs">
                    <tbody>
                      {lines.map((line, i) => (
                        <tr
                          key={i}
                          className={
                            line.type === 'add'
                              ? 'bg-accent-green/5 hover:bg-accent-green/10'
                              : line.type === 'remove'
                              ? 'bg-accent-red/5 hover:bg-accent-red/10'
                              : 'hover:bg-bg-elevated'
                          }
                        >
                          <td className="w-8 select-none border-r border-bg-border px-2 py-0.5 text-right text-gray-700">
                            {i + 1}
                          </td>
                          <td className="w-6 px-2 py-0.5 text-center">
                            {line.type === 'add' ? (
                              <Plus className="inline h-2.5 w-2.5 text-accent-green" />
                            ) : line.type === 'remove' ? (
                              <Minus className="inline h-2.5 w-2.5 text-accent-red" />
                            ) : (
                              <Equal className="inline h-2.5 w-2.5 text-gray-700" />
                            )}
                          </td>
                          <td
                            className={`whitespace-pre px-2 py-0.5 ${
                              line.type === 'add'
                                ? 'text-accent-green'
                                : line.type === 'remove'
                                ? 'text-accent-red'
                                : 'text-gray-400'
                            }`}
                          >
                            {line.text || ' '}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
