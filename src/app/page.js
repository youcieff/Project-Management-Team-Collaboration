"use client";

import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";
import Header from "../components/Header";
import DashboardView from "../components/DashboardView";
import KanbanBoard from "../components/KanbanBoard";
import TaskDetailModal from "../components/TaskDetailModal";

export default function Home() {
  const { view, mounted } = useBoard();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Guard to wait for localStorage loading in client context
  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#060b13] select-none">
        {/* Sleek cyberpunk spinner */}
        <div className="w-10 h-10 border-2 border-brand-emerald/10 border-t-brand-emerald rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase mt-4 animate-pulse">
          Booting Workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      {/* Header bar containing Search, filters, and user Role Switcher */}
      <Header />

      {/* Dynamic View Selector */}
      {view === "dashboard" ? (
        <DashboardView />
      ) : (
        <KanbanBoard onTaskClick={(id) => setSelectedTaskId(id)} />
      )}

      {/* Task Details panel overlay */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
