"use client";

import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";

export default function Header() {
    const {
        currentUser,
        members,
        changeUserRole,
        view,
        searchQuery,
        setSearchQuery,
        priorityFilter,
        setPriorityFilter,
        memberFilter,
        setMemberFilter
    } = useBoard();

    const [showRoleMenu, setShowRoleMenu] = useState(false);

    return (
        <header className="h-16 border-b border-dark-border px-6 flex items-center justify-between bg-[#070b14]/90 backdrop-blur-md select-none sticky top-0 z-20">
            {/* Title / Current View Indicator */}
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide">
                    {view === "dashboard" ? "Management Overview" : "Kanban Taskboard"}
                </h1>
                {view === "board" && (
                    <span className="text-[10px] uppercase bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald px-1.5 py-0.5 font-bold tracking-wider rounded-sm">
                        Interactive Board
                    </span>
                )}
            </div>

            {/* Global Filters & Simulator */}
            <div className="flex items-center gap-4">
                {/* Search Input (Only when viewing board) */}
                {view === "board" && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 bg-dark-bg/60 border border-dark-border px-8 py-1.5 rounded-sm text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-emerald/50 focus:ring-1 focus:ring-brand-emerald/20 transition-all font-medium"
                        />
                        <svg
                            className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                )}

                {/* Priority Filter */}
                {view === "board" && (
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-dark-bg/60 border border-dark-border px-2.5 py-1.5 rounded-sm text-xs font-semibold text-slate-350 focus:outline-none focus:border-brand-emerald/50 transition-all cursor-pointer"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">🔥 High</option>
                        <option value="medium">⚡ Medium</option>
                        <option value="low">⚙️ Low</option>
                    </select>
                )}

                {/* Member Filter */}
                {view === "board" && (
                    <select
                        value={memberFilter}
                        onChange={(e) => setMemberFilter(e.target.value)}
                        className="bg-dark-bg/60 border border-dark-border px-2.5 py-1.5 rounded-sm text-xs font-semibold text-slate-350 focus:outline-none focus:border-brand-emerald/50 transition-all cursor-pointer"
                    >
                        <option value="all">All Assignees</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name.split(" ")[0]} ({m.role})</option>
                        ))}
                    </select>
                )}

                {/* Role Simulator Switcher - CRITICAL FOR RECRUITERS */}
                <div className="relative">
                    <button
                        onClick={() => setShowRoleMenu(!showRoleMenu)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-brand-emerald/10 border border-brand-emerald/30 hover:border-brand-emerald/70 rounded-sm transition-all focus:outline-none cursor-pointer"
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-pulse"></div>
                        <span className="text-[11px] font-bold tracking-wider text-brand-emerald uppercase">
                            Role: {currentUser.role}
                        </span>
                        <svg
                            className={`h-3 w-3 text-brand-emerald transition-transform ${showRoleMenu ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showRoleMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-dark-surface border border-dark-border shadow-2xl rounded-sm p-2 z-30 animate-fade-in glass-panel">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-1.5 border-b border-dark-border/40">
                                Switch Simulator Identity
                            </div>
                            <div className="mt-1.5 space-y-0.5">
                                {members.map((mbr) => (
                                    <button
                                        key={mbr.id}
                                        onClick={() => {
                                            changeUserRole(mbr.id);
                                            setShowRoleMenu(false);
                                        }}
                                        className={`w-full text-left px-2 py-1.5 rounded-sm text-xs font-medium flex items-center justify-between transition-colors ${mbr.id === currentUser.id
                                                ? "bg-brand-emerald/10 text-white"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`w-6 h-6 flex items-center justify-center font-bold text-[9px] rounded-sm ${mbr.color}`}>
                                                {mbr.initials}
                                            </span>
                                            <span>{mbr.name}</span>
                                        </div>
                                        <span className="text-[9px] uppercase px-1.5 py-0.5 font-bold tracking-wide rounded-sm bg-slate-900 border border-dark-border text-slate-400">
                                            {mbr.role}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {currentUser.role === "Viewer" && (
                                <div className="mt-2 p-1.5 bg-rose-950/20 border border-rose-920/40 rounded-sm text-[10px] text-rose-450 leading-relaxed font-semibold">
                                    ⚠️ View-Only Mode: Drag-and-drop & editing is restricted to mimic access control.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
