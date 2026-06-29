export const MOCK_MEMBERS = [
  { id: "usr-1", name: "Youssef Admin", role: "Admin", initials: "YA", color: "bg-brand-emerald text-dark-bg" },
  { id: "usr-2", name: "Ahmed Dev", role: "Member", initials: "AD", color: "bg-blue-500 text-white" },
  { id: "usr-3", name: "Sara QA", role: "Member", initials: "SQ", color: "bg-amber-500 text-dark-bg" },
  { id: "usr-4", name: "Guest Recruiter", role: "Viewer", initials: "GR", color: "bg-rose-500 text-white" }
];

export const MOCK_PROJECTS = [
  { id: "proj-1", name: "FlowBoard App", key: "FB", status: "Active", progress: 65, color: "border-brand-emerald" },
  { id: "proj-2", name: "Talabat Junior", key: "TJ", status: "Active", progress: 80, color: "border-blue-500" },
  { id: "proj-3", name: "Velora E-Commerce", key: "VE", status: "Maintenance", progress: 95, color: "border-amber-500" }
];

export const MOCK_TASKS = [
  {
    id: "task-101",
    projectId: "proj-1",
    title: "Implement Real-time simulator",
    description: "Write the context state and storage trigger for Role Switcher and live Activity Feed.",
    priority: "high",
    column: "in_progress",
    assigneeId: "usr-1",
    dueDate: "2026-07-02",
    subtasks: [
      { id: "sub-1", title: "Write BoardContext logic", completed: true },
      { id: "sub-2", title: "Sync simulated user storage", completed: false },
      { id: "sub-3", title: "Create Role Switcher UI", completed: false }
    ],
    comments: [
      { id: "c1", userId: "usr-2", text: "Working on syncing layout dynamically.", date: "2026-06-29T10:30:00Z" }
    ],
    createdAt: "2026-06-29T08:00:00Z"
  },
  {
    id: "task-102",
    projectId: "proj-1",
    title: "Design Cyberpunk layout & styling",
    description: "Implement CSS variables for dark background and emerald-fused elements in globals.css.",
    priority: "medium",
    column: "done",
    assigneeId: "usr-1",
    dueDate: "2026-06-29",
    subtasks: [
      { id: "sub-4", title: "Define tailwind v4 @theme", completed: true },
      { id: "sub-5", title: "Test scrollbars and neon glows", completed: true }
    ],
    comments: [],
    createdAt: "2026-06-28T09:00:00Z"
  },
  {
    id: "task-103",
    projectId: "proj-1",
    title: "HTML5 Drag and Drop Kanban Board",
    description: "Implement native HTML5 dragover, dragstart, dragleave, drop handlers on task columns and cards.",
    priority: "high",
    column: "todo",
    assigneeId: "usr-2",
    dueDate: "2026-07-05",
    subtasks: [
      { id: "sub-6", title: "Setup drag events", completed: false },
      { id: "sub-7", title: "Handle visual indicators on dragEnter", completed: false }
    ],
    comments: [],
    createdAt: "2026-06-29T08:15:00Z"
  },
  {
    id: "task-201",
    projectId: "proj-2",
    title: "Dynamic Promo Codes module",
    description: "Integrate database-backed promo codes CRUD. Add validation and discount deduction schema.",
    priority: "high",
    column: "in_review",
    assigneeId: "usr-2",
    dueDate: "2026-07-01",
    subtasks: [
      { id: "sub-8", title: "Create Offers Schema", completed: true },
      { id: "sub-9", title: "Test Coupon check API", completed: false }
    ],
    comments: [
      { id: "c2", userId: "usr-3", text: "Requires review on discount formulas.", date: "2026-06-29T11:00:00Z" }
    ],
    createdAt: "2026-06-27T10:00:00Z"
  },
  {
    id: "task-301",
    projectId: "proj-3",
    title: "Vercel Mock Data Deployment fallback",
    description: "Write fallback interceptors on frontend dashboard to guarantee zero downtime even if Mongo atlas sleeps.",
    priority: "medium",
    column: "done",
    assigneeId: "usr-3",
    dueDate: "2026-06-25",
    subtasks: [
      { id: "sub-10", title: "Write interceptor checks", completed: true }
    ],
    comments: [],
    createdAt: "2026-06-25T11:00:00Z"
  }
];

export const INITIAL_ACTIVITIES = [
  { id: "act-1", userId: "usr-1", action: "created", target: "task-101", details: "Implement Real-time simulator", date: "2026-06-29T08:00:00Z" },
  { id: "act-2", userId: "usr-1", action: "moved", target: "task-102", details: "Design Cyberpunk layout & styling to Done", date: "2026-06-29T08:10:00Z" },
  { id: "act-3", userId: "usr-2", action: "added comment", target: "task-101", details: "Working on syncing layout dynamically.", date: "2026-06-29T10:30:00Z" }
];
