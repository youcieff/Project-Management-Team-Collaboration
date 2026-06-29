"use client";

import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";

export default function TaskDetailModal({ taskId, onClose }) {
    const {
        tasks,
        members,
        activities,
        toggleSubtask,
        addComment,
        updateTask,
        deleteTask,
        hasEditPermission
    } = useBoard();

    const task = tasks.find((t) => t.id === taskId);
    const [commentText, setCommentText] = useState("");
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [descText, setDescText] = useState(task?.description || "");

    if (!task) return null;

    const assignee = members.find((m) => m.id === task.assigneeId);
    const taskActivities = activities.filter((a) => a.target === task.id);

    // Subtask submission
    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim() || !hasEditPermission()) return;

        const newSub = {
            id: `sub-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false
        };

        updateTask(task.id, {
            subtasks: [...(task.subtasks || []), newSub]
        });
        setNewSubtaskTitle("");
    };

    // Modify task details (priority/assignee)
    const handleFieldChange = (field, value) => {
        if (!hasEditPermission()) return;
        updateTask(task.id, { [field]: value });
    };

    // Save Description
    const handleSaveDescription = () => {
        if (!hasEditPermission()) return;
        updateTask(task.id, { description: descText });
        setIsEditingDesc(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-rose-950/20 text-rose-500 border-rose-920/30";
            case "medium": return "bg-amber-950/20 text-amber-500 border-amber-920/30";
            default: return "bg-slate-800 text-slate-400 border-slate-700";
        }
    };

    const handleDelete = () => {
        if (!hasEditPermission()) return;
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(task.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
            {/* Modal Card Backing */}
            <div
                className="w-full max-w-3xl bg-[#090e1a] border border-dark-border rounded-sm shadow-2xl overflow-hidden glass-panel max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header toolbar */}
                <div className="p-4 border-b border-dark-border flex items-center justify-between bg-dark-bg/40">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                            Task Details #{task.id.split("-")[1]}
                        </span>
                        <span className={`px-2 py-0.5 rounded-sm border text-[9px] uppercase tracking-wide font-bold ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-sm transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Modal Main Split Body */}
                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 min-h-0">

                    {/* Left section: description, subtasks, comment lists (width 2/3) */}
                    <div className="md:col-span-2 p-6 space-y-6 border-r border-dark-border/40 overflow-y-auto">
                        {/* Title */}
                        <div>
                            {hasEditPermission() ? (
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleFieldChange("title", e.target.value)}
                                    className="w-full bg-transparent hover:bg-slate-800/20 text-lg font-bold text-white focus:bg-dark-bg focus:border border-dark-border px-2 py-1 -ml-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald/20"
                                />
                            ) : (
                                <h3 className="text-lg font-bold text-white">{task.title}</h3>
                            )}
                        </div>

                        {/* Description editing panel */}
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Description</label>
                            {isEditingDesc && hasEditPermission() ? (
                                <div className="space-y-2">
                                    <textarea
                                        rows={4}
                                        value={descText}
                                        onChange={(e) => setDescText(e.target.value)}
                                        className="w-full bg-dark-bg border border-dark-border p-3 rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald/50"
                                        placeholder="Provide description context..."
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setIsEditingDesc(false); setDescText(task.description || ""); }}
                                            className="px-2.5 py-1 bg-slate-800 text-slate-450 hover:text-white text-[10px] uppercase font-bold rounded-sm cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveDescription}
                                            className="px-2.5 py-1 bg-brand-emerald text-dark-bg text-[10px] uppercase font-bold rounded-sm cursor-pointer hover:bg-brand-emerald/90 transition-technical"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => hasEditPermission() && setIsEditingDesc(true)}
                                    className={`text-slate-350 text-xs p-3 bg-dark-surface border border-dark-border/60 rounded-sm leading-relaxed ${hasEditPermission() ? "hover:bg-slate-805/30 hover:border-slate-800 cursor-pointer" : ""
                                        }`}
                                >
                                    {task.description || <span className="text-slate-650 italic">No description details provided. Click to add.</span>}
                                </div>
                            )}
                        </div>

                        {/* Subtasks checklist */}
                        <div className="space-y-3">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Subtasks checklist</label>
                            <div className="space-y-1.5">
                                {task.subtasks?.map((sub) => (
                                    <label
                                        key={sub.id}
                                        className={`flex items-center gap-3 p-2 bg-dark-surface/50 border border-dark-border/40 rounded-sm text-xs text-slate-350 select-none cursor-pointer hover:border-slate-800 transition-colors ${sub.completed ? "line-through text-slate-500" : ""
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            disabled={!hasEditPermission()}
                                            checked={sub.completed}
                                            onChange={() => toggleSubtask(task.id, sub.id)}
                                            className="rounded-xs border-dark-border text-brand-emerald bg-dark-bg focus:ring-0 cursor-pointer"
                                        />
                                        <span className="font-medium">{sub.title}</span>
                                    </label>
                                ))}
                            </div>

                            {hasEditPermission() && (
                                <form onSubmit={handleAddSubtask} className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        placeholder="New subtask item..."
                                        value={newSubtaskTitle}
                                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                        className="flex-1 bg-dark-bg border border-dark-border px-3 py-1.5 rounded-sm text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-emerald/40"
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-slate-700 border border-dark-border transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Comments implementation */}
                        <div className="space-y-4">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Comments & Mentions</label>

                            {/* Comment inputs */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!commentText.trim()) return;
                                    addComment(task.id, commentText.trim());
                                    setCommentText("");
                                }}
                                className="space-y-2 border-t border-dark-border/40 pt-4"
                            >
                                <textarea
                                    rows={2}
                                    required
                                    placeholder="Post comments to simulated thread..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border p-3 rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald/50"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-brand-emerald text-dark-bg text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer hover:bg-brand-emerald/90 transition-technical"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            </form>

                            {/* Feed of comments */}
                            <div className="space-y-3 mt-4">
                                {task.comments?.length === 0 ? (
                                    <div className="text-[11px] text-slate-500 italic py-2 font-medium">No comments posted yet.</div>
                                ) : (
                                    task.comments?.slice().reverse().map((comm) => {
                                        const author = members.find(m => m.id === comm.userId);
                                        return (
                                            <div key={comm.id} className="p-3 bg-dark-surface/40 border border-dark-border/40 rounded-sm text-xs space-y-1">
                                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`w-4 h-4 flex items-center justify-center text-[7px] font-bold rounded-xs ${author?.color || 'bg-slate-800'}`}>
                                                            {author?.initials || "?"}
                                                        </span>
                                                        <span className="text-slate-350">{author?.name}</span>
                                                    </div>
                                                    <span>{new Date(comm.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                                </div>
                                                <p className="text-slate-400 pl-5 leading-relaxed font-medium">{comm.text}</p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right section: details/meta widgets (width 1/3) */}
                    <div className="p-6 bg-dark-bg/25 space-y-5 overflow-y-auto">
                        {/* User Assignee */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Assignee</label>
                            {hasEditPermission() ? (
                                <select
                                    value={task.assigneeId}
                                    onChange={(e) => handleFieldChange("assigneeId", e.target.value)}
                                    className="w-full bg-dark-surface border border-dark-border px-2 py-1.5 rounded-sm text-xs text-slate-350 focus:outline-none cursor-pointer"
                                >
                                    {members.map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center gap-2 p-1.5 border border-transparent">
                                    <span className={`w-6 h-6 flex items-center justify-center font-bold text-[9px] rounded-sm ${assignee?.color || 'bg-slate-800'}`}>
                                        {assignee?.initials || "?"}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-350">{assignee?.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Task Priority Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Priority Class</label>
                            {hasEditPermission() ? (
                                <select
                                    value={task.priority}
                                    onChange={(e) => handleFieldChange("priority", e.target.value)}
                                    className="w-full bg-dark-surface border border-dark-border px-2 py-1.5 rounded-sm text-xs text-slate-350 focus:outline-none cursor-pointer"
                                >
                                    <option value="high">High Class</option>
                                    <option value="medium">Medium Class</option>
                                    <option value="low">Low Class</option>
                                </select>
                            ) : (
                                <span className="text-xs font-semibold text-slate-350 pl-1 capitalize">{task.priority} priority</span>
                            )}
                        </div>

                        {/* Task Due Date */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Due Date</label>
                            {hasEditPermission() ? (
                                <input
                                    type="date"
                                    value={task.dueDate}
                                    onChange={(e) => handleFieldChange("dueDate", e.target.value)}
                                    className="w-full bg-dark-surface border border-dark-border px-2 py-1 rounded-sm text-xs text-slate-350 focus:outline-none cursor-pointer"
                                />
                            ) : (
                                <span className="text-xs font-semibold text-slate-350 pl-1">{task.dueDate}</span>
                            )}
                        </div>

                        {/* Task Status Column Indicator */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Workflow Column</label>
                            {hasEditPermission() ? (
                                <select
                                    value={task.column}
                                    onChange={(e) => handleFieldChange("column", e.target.value)}
                                    className="w-full bg-dark-surface border border-dark-border px-2 py-1.5 rounded-sm text-xs text-slate-350 focus:outline-none cursor-pointer"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="in_review">In Review</option>
                                    <option value="done">Completed</option>
                                </select>
                            ) : (
                                <span className="text-xs font-semibold text-slate-350 pl-1 uppercase">{task.column.replace("_", " ")}</span>
                            )}
                        </div>

                        {/* Audit log trail specific for this task */}
                        <div className="space-y-2 border-t border-dark-border/40 pt-4">
                            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block">Audit History</label>
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {taskActivities.map((act) => {
                                    const userObj = members.find(m => m.id === act.userId);
                                    return (
                                        <div key={act.id} className="text-[10px] text-slate-400 group">
                                            <div className="flex justify-between font-semibold text-slate-500 mb-0.5">
                                                <span>{userObj?.name.split(" ")[0]}</span>
                                                <span>{new Date(act.date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                                            </div>
                                            <span className="italic leading-normal text-slate-450">{act.action.replace("_", " ")}: {act.details.replace(task.title, "").replace(`"${task.title}"`, "").trim() || "Details edited"}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dangerous Actions (Delete button) */}
                        {hasEditPermission() && (
                            <div className="border-t border-dark-border/30 pt-4">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full py-2 bg-rose-950/20 hover:bg-rose-900/30 hover:text-white border border-rose-920/40 text-rose-500 text-xs uppercase tracking-wider font-bold rounded-sm transition-colors cursor-pointer"
                                >
                                    Delete Task
                                </button>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
}
