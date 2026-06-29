# FlowBoard — Project Management Dashboard

A high-end, frontend-first SaaS project management application built with **Next.js 15 App Router** and **Tailwind CSS v4**. Inspired by tools like Linear and Jira, but with a distinctive dark *cyberpunk glassmorphic* visual identity.

> **Demo Mode** — Fully functional without a backend. All state is managed via React Context API + `localStorage`, making it instantly deployable and showcaseable.

---

## ✨ Features

- **Kanban Board** — Native HTML5 drag-and-drop across workflow columns (To Do → In Progress → In Review → Done)
- **Management Dashboard** — SVG circular progress gauge, task distribution bar charts, and team workload metrics
- **Role Switcher Simulator** — Switch between Admin, Member, and Viewer roles in real time; Viewer mode restricts all editing/drag actions to mimic real RBAC
- **Task Detail Modal** — Subtasks checklist, threaded comments, assignee/priority/due-date editing, and per-task audit trail
- **Live Activity Log** — Collapsible sidebar listing all simulated user actions with timestamps
- **Project Filters** — Search, priority, and member filters on the Kanban view
- **LocalStorage Persistence** — All changes survive page refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| State | React Context API |
| Persistence | Browser `localStorage` |
| Language | JavaScript (ES2024) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js       # Root layout with providers
│   ├── page.js         # Main entry — dynamic view switcher
│   └── globals.css     # Design tokens + Tailwind v4 @theme
├── components/
│   ├── Sidebar.jsx         # Navigation + project selector
│   ├── Header.jsx          # Filters + Role Switcher
│   ├── DashboardView.jsx   # KPI cards + charts
│   ├── KanbanBoard.jsx     # Drag-and-drop board
│   ├── TaskDetailModal.jsx # Full task detail overlay
│   └── ActivitySidebar.jsx # Live activity log
├── context/
│   └── BoardContext.js  # Global state + localStorage sync
└── data/
    └── mockData.js      # Initial demo data
```

---

## 🎨 Design System

- **Background:** `#060b13` (Deep Slate)
- **Accent:** `#10b981` (Emerald Green)
- **Geometry:** Sharp `2px` corners — no rounded blobs
- **No purple** — ever

---

## 📄 License

MIT
