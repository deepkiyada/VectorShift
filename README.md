# VectorShift Workflow Editor

A Next.js application optimized for client-side React Flow workflow editing. This is a SPA-style editor with minimal routing and no SSR reliance.

## Features

- **Client-side only rendering** - All React Flow components are dynamically imported with `ssr: false`
- **Minimal routing** - Single page application focused on the workflow editor
- **Clean project structure** - Organized components and configuration
- **Modern UI** - Clean, professional interface with React Flow controls

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout (no SSR)
│   ├── page.tsx            # Main page with dynamic import
│   └── globals.css         # Global styles
├── components/
│   └── WorkflowEditor.tsx  # Main React Flow editor component
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Technology Stack

- **Next.js 14** - React framework with App Router
- **React Flow** - Powerful workflow/node editor library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS (via inline styles for minimal setup)

## Usage

The editor supports:
- Dragging nodes
- Connecting nodes with edges
- Zoom and pan controls
- Mini map for navigation
- Background grid for alignment

## Development Notes

- All React Flow components are client-side only (`'use client'` directive)
- Dynamic imports ensure no SSR for the editor component
- Minimal routing - single page focused on the editor experience
