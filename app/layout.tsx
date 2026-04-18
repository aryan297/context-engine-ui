import type { Metadata } from 'next'
import './globals.css'
import { ConfigProvider } from '@/lib/config-context'
import { AppShell } from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'Context Engine',
  description: 'Reduce LLM token usage with smart context retrieval',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-base">
        <ConfigProvider>
          <AppShell>{children}</AppShell>
        </ConfigProvider>
      </body>
    </html>
  )
}
