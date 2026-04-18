# Context Engine UI

A Next.js frontend for the Context Engine system — visualize project graphs, query codebases, and track changes.

---

## Tech Stack

| Layer        | Library                          |
|--------------|----------------------------------|
| Framework    | Next.js 14.2 (App Router)        |
| Language     | TypeScript 5                     |
| Styling      | Tailwind CSS 3.4                 |
| Graph viz    | Cytoscape.js 3.29                |
| Icons        | Lucide React                     |
| Runtime      | Node.js ≥ 18                     |

---

## Prerequisites

- **Node.js ≥ 18** — `node -v` to check
- **npm ≥ 9** — `npm -v` to check
- **Context Engine backend** running on `localhost:8080` (optional — pages work with mock data without it)

---

## Quick Start

```bash
# 1. Enter the UI directory
cd context-engine-ui

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

---

## Environment Variables

Create a `.env.local` file in `context-engine-ui/` to override defaults:

```env
# URL of the Go backend (default: http://localhost:8080)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

No other variables are required.

---

## Available Scripts

| Command           | What it does                                      |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Start development server with hot reload           |
| `npm run build`   | Production build (outputs to `.next/`)             |
| `npm run start`   | Serve the production build (run `build` first)     |
| `npm run lint`    | Run ESLint across all source files                 |

---

## Pages

### `/dashboard` — Projects Overview

- Stats grid: total projects, files, functions, cache hit rate
- Project cards with status badges (`active`, `indexing`, `error`)
- Recent activity feed (ingestion events)
- **Ingest Project** button → opens a modal that calls `POST /v1/ingest-project`

### `/explorer` — Context Explorer

- Interactive Cytoscape.js graph: **Project → File → Function → Import** nodes
- Left sidebar: switch project, toggle Functions / Imports visibility
- Click any node → right panel shows id, path, signature, summary
- Zoom: scroll wheel · Pan: click + drag

### `/query` — Query Playground

- Select a project from the dropdown in the topbar
- Type a natural language question and press **Enter** (or click send)
- Calls `POST /v1/query-context` → displays matched files, functions, and graph-expanded related files
- Suggestion chips on the empty state for quick demos
- **Shift + Enter** adds a newline without submitting

### `/changes` — Change Tracking

- Left: vertical timeline of ingestion / update / reindex / delete events
- Right: unified diff view — green `+` lines for additions, red `-` for deletions
- Click any timeline event to load its diff

### `/services` — Services Map

- Cytoscape.js graph of the Context Engine's internal architecture
- Node size = number of functions in that service
- Click a node → right panel shows description, dependencies, and callers
- Click a dependency chip to jump to that service's detail

---

## Folder Structure

```
context-engine-ui/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (AppShell wraps all pages)
│   ├── page.tsx                # Redirects / → /dashboard
│   ├── globals.css             # Tailwind base + scrollbar styles
│   ├── dashboard/page.tsx
│   ├── explorer/page.tsx
│   ├── query/page.tsx
│   ├── changes/page.tsx
│   └── services/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # Sidebar + main content wrapper
│   │   ├── Sidebar.tsx         # Nav links + API status indicator
│   │   └── Topbar.tsx          # Page title + action slot
│   ├── dashboard/
│   │   ├── StatsGrid.tsx       # 4-column stats cards
│   │   ├── ProjectCard.tsx     # Individual project card
│   │   └── RecentActivity.tsx  # Event feed
│   ├── explorer/
│   │   ├── GraphView.tsx       # Cytoscape.js wrapper (client-only)
│   │   ├── FilterBar.tsx       # Project selector + node toggles
│   │   └── NodePanel.tsx       # Selected node detail panel
│   ├── query/
│   │   ├── MessageBubble.tsx   # User / assistant chat bubble
│   │   └── QueryInput.tsx      # Textarea + send button
│   ├── changes/
│   │   ├── Timeline.tsx        # Vertical event list
│   │   └── DiffView.tsx        # Line-by-line diff renderer
│   ├── services/
│   │   └── ServiceMap.tsx      # Cytoscape service graph (client-only)
│   └── ui/                     # Reusable primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Spinner.tsx
│
├── lib/
│   ├── api.ts                  # All fetch() calls to the backend
│   ├── types.ts                # Shared TypeScript interfaces
│   └── mock-data.ts            # Sample data (used when API is offline)
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Connecting to the Backend

The frontend calls two real endpoints:

| Action          | Endpoint                  | Page         |
|-----------------|---------------------------|--------------|
| Ingest project  | `POST /v1/ingest-project` | Dashboard    |
| Query context   | `POST /v1/query-context`  | Query        |

All other pages (Explorer, Changes, Services) use mock data from `lib/mock-data.ts`.

**To swap mock data for real API responses**, edit `lib/mock-data.ts` or replace the data sources in each page with `useEffect` + `fetch` calls using the helpers in `lib/api.ts`.

**To start the backend** (from the `context-engine/` directory):

```bash
# Start infrastructure
docker compose up -d

# Run the server
go run ./cmd/server serve
```

Then run the UI:

```bash
npm run dev
```

---

## Running Both Together

From the repo root:

```bash
# Terminal 1 — backend
cd context-engine
docker compose up -d
go run ./cmd/server serve

# Terminal 2 — frontend
cd context-engine-ui
npm run dev
```

| Service          | URL                          |
|------------------|------------------------------|
| Frontend         | http://localhost:3000        |
| Backend API      | http://localhost:8080        |
| Neo4j Browser    | http://localhost:7474        |

---

## Production Build

```bash
npm run build
npm run start
```

The build output is in `.next/`. To deploy, point any Node.js host (Vercel, Railway, Render) at this directory or use `next start` behind a reverse proxy.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `npm install` fails | Ensure Node ≥ 18: `node -v` |
| API status shows "Offline" in sidebar | Start the Go backend: `go run ./cmd/server serve` |
| Graph is blank on Explorer/Services | Cytoscape requires a real browser — SSR is disabled for those components; hard-refresh the page |
| Query returns an error | Check that `docker compose up -d` is running (Postgres + Neo4j + Redis all need to be healthy) |
| Port 3000 already in use | `npm run dev -- -p 3001` to use a different port |
