'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Loading component for editor
const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666',
    }}
  >
    Loading editor...
  </div>
)

// Dynamically import ReactFlow to ensure client-side only rendering
const WorkflowEditor = dynamic(() => import('@/components/WorkflowEditor'), {
  ssr: false,
  loading: LoadingFallback,
})

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WorkflowEditor />
    </Suspense>
  )
}
