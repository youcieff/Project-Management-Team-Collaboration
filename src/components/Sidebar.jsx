"use client";

import React from "react";
import { useBoard } from "../context/BoardContext";

export default function Sidebar() {
    const {
        projects,
        activeProjectId,
        setActiveProjectId,
        view,
        setView
    } = useBoard();

    return (
        <aside className="w-64 bg-[#0a0f1d] border-r border-dark-border flex flex-col h-full select-none">
            {/* Brand Logo */}
            <div className="h-16 flex items-center px-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-brand-emerald flex items-center justify-center font-bold text-dark-bg neon-border-emerald">
                        F
                    </div>
                    <span className="font-bold text-xl tracking-wider text-white">
                        FLOW<span className="text-brand-emerald">BOARD</span>
                    </span>
                </div>
            </div>

            {/* Main Views Navigation */}
            <div className="px-4 py-6">
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-4 px-2">
                    Views
                </label>
                <nav className="space-y-1">
                    <button
                        onClick={() => setView("dashboard")}
                        className={`w-full text-left px-4 py-2.5 rounded-sm font-semibold text-sm flex items-center transition-all ${view === "dashboard"
                                ? "bg-brand-emerald/10 text-brand-emerald border-l-2 border-brand-emerald pl-3"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                        </svg>
                        Overview Panel
                    </button>

                    <button
                        onClick={() => setView("board")}
                        className={`w-full text-left px-4 py-2.5 rounded-sm font-semibold text-sm flex items-center transition-all ${view === "board"
                                ? "bg-brand-emerald/10 text-brand-emerald border-l-2 border-brand-emerald pl-3"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v3M3 12h18" />
                        </svg>
                        Kanban Board
                    </button>
                </nav>
            </div>

            {/* Projects List Filter */}
            <div className="px-4 py-2 flex-grow overflow-y-auto">
                <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-4 px-2">
                    Projects
                </label>
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveProjectId(null)}
                        className={`w-full text-left px-4 py-2 rounded-sm font-semibold text-sm flex items-center transition-all ${activeProjectId === null
                                ? "bg-slate-800/80 text-white border-l-2 border-brand-emerald pl-3"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                            }`}
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 mr-3 border border-dark-border"></div>
                        All Projects
                    </button>

                    {projects.map((proj) => (
                        <button
                            key={proj.id}
                            onClick={() => setActiveProjectId(proj.id)}
                            className={`w-full text-left px-4 py-2 rounded-sm font-semibold text-sm flex items-center transition-all ${activeProjectId === proj.id
                                    ? "bg-slate-800/80 text-white border-l-2 border-brand-emerald pl-3"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                                }`}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full mr-3 border ${proj.id === "proj-1" ? "bg-brand-emerald" : proj.id === "proj-2" ? "bg-blue-500" : "bg-amber-500"
                                }`}></div>
                            {proj.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Profile details */}
            <div className="border-t border-dark-border p-4 bg-[#080d19]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center font-bold text-xs text-brand-emerald">
                        YA
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-white">Youssef Admin</div>
                        <div className="text-[10px] text-slate-500">Portfolio Dev</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
