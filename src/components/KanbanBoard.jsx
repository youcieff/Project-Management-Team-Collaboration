"use client";

import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";

export default function KanbanBoard({ onTaskClick }) {
    const {
        filteredTasks,
        moveTask,
        addTask,
        members,
        hasEditPermission
    } = useBoard();

    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [activeNewTaskCol, setActiveNewTaskCol] = useState(null);

    // Quick Task form fields
    const [newTitle, setNewTitle] = useState("");
    const [newPriority, setNewPriority] = useState("medium");
    const [newAssignee, setNewAssignee] = useState("usr-1");

    const columns = [
        { id: "todo", name: "To Do", color: "bg-slate-700/50" },
        { id: "in_progress", name: "In Progress", color: "bg-amber-500/50" },
        { id: "in_review", name: "In Review", color: "bg-blue-500/50" },
        { id: "done", name: "Completed", color: "bg-brand-emerald/50" }
    ];

    // Drag Handlers
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData("text/plain", taskId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        if (!hasEditPermission()) return;
        setDragOverColumn(colId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e, colId) => {
        e.preventDefault();
        setDragOverColumn(null);
        if (!hasEditPermission()) return;

        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) {
            moveTask(taskId, colId);
        }
    };

    // Submit quick task
    const handleQuickAdd = (e, colId) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        addTask({
            title: newTitle.trim(),
            priority: newPriority,
            assigneeId: newAssignee,
            column: colId
        });

        // Reset Quick Add setup
        setNewTitle("");
        setActiveNewTaskCol(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-rose-950/30 text-rose-450 border-rose-920/40";
            case "medium": return "bg-amber-950/20 text-amber-500 border-amber-920/30";
            default: return "bg-slate-800 text-slate-400 border-slate-700";
        }
    };

    return (
        <div className="flex-1 p-6 flex flex-col min-h-0 select-none">

            {/* Board Panel Root Columns Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0 overflow-y-auto md:overflow-y-hidden">

                {columns.map((col) => {
                    const colTasks = filteredTasks.filter((t) => t.column === col.id);
                    const isDraggingOver = dragOverColumn === col.id;

                    return (
                        <div
                            key={col.id}
                            onDragOver={(e) => handleDragOver(e, col.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex flex-col h-full bg-[#0a0f1d]/75 border rounded-sm min-h-[400px] md:min-h-0 transition-all ${isDraggingOver
                                    ? "border-brand-emerald bg-slate-800/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                                    : "border-dark-border"
                                }`}
                        >

                            {/* Column Header */}
                            <div className="p-4 border-b border-dark-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${col.id === "todo" ? "bg-slate-500" : col.id === "in_progress" ? "bg-amber-500" : col.id === "in_review" ? "bg-blue-500" : "bg-brand-emerald"
                                        }`}></span>
                                    <span className="font-bold text-xs tracking-wider text-white uppercase">{col.name}</span>
                                    <span className="px-2 py-0.5 bg-slate-900 border border-dark-border/60 rounded-sm text-[9px] text-slate-400 font-bold">
                                        {colTasks.length}
                                    </span>
                                </div>

                                {hasEditPermission() && (
                                    <button
                                        onClick={() => setActiveNewTaskCol(activeNewTaskCol === col.id ? null : col.id)}
                                        className="p-1 hover:bg-slate-800 border border-transparent hover:border-dark-border hover:text-white text-slate-400 rounded-sm transition-colors cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Tasks List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3">

                                {/* Conditionally reveal Quick Add input at top of column */}
                                {activeNewTaskCol === col.id && (
                                    <form
                                        onSubmit={(e) => handleQuickAdd(e, col.id)}
                                        className="bg-dark-surface border border-brand-emerald/40 p-3 rounded-sm space-y-3 animate-fade-in shadow-xl"
                                    >
                                        <input
                                            type="text"
                                            required
                                            autoFocus
                                            placeholder="Task title..."
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full bg-dark-bg border border-dark-border px-3 py-1.5 rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald/40"
                                        />

                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            <div>
                                                <label className="text-slate-500 font-bold uppercase block mb-1">Priority</label>
                                                <select
                                                    value={newPriority}
                                                    onChange={(e) => setNewPriority(e.target.value)}
                                                    className="w-full bg-dark-bg border border-dark-border px-2 py-1 rounded-sm text-slate-350 focus:outline-none cursor-pointer"
                                                >
                                                    <option value="high">High</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="low">Low</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-slate-500 font-bold uppercase block mb-1">Assignee</label>
                                                <select
                                                    value={newAssignee}
                                                    onChange={(e) => setNewAssignee(e.target.value)}
                                                    className="w-full bg-dark-bg border border-dark-border px-2 py-1 rounded-sm text-slate-350 focus:outline-none cursor-pointer"
                                                >
                                                    {members.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name.split(" ")[0]}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-1 border-t border-dark-border/40">
                                            <button
                                                type="button"
                                                onClick={() => setActiveNewTaskCol(null)}
                                                className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-2.5 py-1 bg-brand-emerald text-dark-bg text-[10px] uppercase font-bold rounded-sm cursor-pointer hover:bg-brand-emerald/90 transition-technical"
                                            >
                                                Add Task
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {colTasks.length === 0 ? (
                                    <div className="text-center text-xs text-slate-600 py-8 font-semibold border border-dashed border-dark-border/50 rounded-sm">
                                        Drag tasks here
                                    </div>
                                ) : (
                                    colTasks.map((task) => {
                                        const assignee = members.find((m) => m.id === task.assigneeId);
                                        const completedSubs = task.subtasks.filter(s => s.completed).length;

                                        return (
                                            <div
                                                key={task.id}
                                                draggable={hasEditPermission()}
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => onTaskClick(task.id)}
                                                className={`bg-dark-surface border border-dark-border p-4 rounded-sm hover:border-slate-700/80 transition-all duration-150 cursor-pointer relative group flex flex-col justify-between min-h-[110px] ${hasEditPermission() ? "active:scale-[0.98] active:border-brand-emerald/50" : ""
                                                    }`}
                                            >
                                                {/* Task Card Header Info */}
                                                <div className="space-y-1 bg-transparent">
                                                    <div className="flex justify-between items-start gap-2 mb-1 pl-0">
                                                        <span className={`px-2 py-0.5 rounded-sm border text-[9px] uppercase tracking-wide font-bold select-none ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <span className="text-[9px] font-mono text-slate-500 select-none">
                                                            #{task.id.split("-")[1] || task.id}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-xs font-semibold text-white group-hover:text-brand-emerald transition-colors leading-snug">
                                                        {task.title}
                                                    </h4>

                                                    {task.description && (
                                                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pt-0.5">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Task Card Footer Stats */}
                                                <div className="flex items-center justify-between border-t border-dark-border/30 pt-3 mt-3">
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                                                        {/* Subtask count */}
                                                        {task.subtasks.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v3m-6 4h4m-4 4h4" />
                                                                </svg>
                                                                {completedSubs}/{task.subtasks.length}
                                                            </span>
                                                        )}
                                                        {/* Comment count */}
                                                        {task.comments.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                </svg>
                                                                {task.comments.length}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Member Assignee badge initials */}
                                                    {assignee && (
                                                        <span
                                                            title={assignee.name}
                                                            className={`w-5 h-5 flex items-center justify-center font-bold text-[8px] rounded-sm select-none border border-dark-border/40 ${assignee.color}`}
                                                        >
                                                            {assignee.initials}
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                        );
                                    })
                                )}
                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}
