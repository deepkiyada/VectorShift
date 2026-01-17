import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VectorShift Workflow Editor',
  description: 'Client-side React Flow workflow editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
