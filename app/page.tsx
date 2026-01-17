'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import ReactFlow to ensure client-side only rendering
const WorkflowEditor = dynamic(() => import('@/components/WorkflowEditor'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Loading editor...
    </div>
  ),
})

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading editor...
      </div>
    }>
      <WorkflowEditor />
    </Suspense>
  )
}
