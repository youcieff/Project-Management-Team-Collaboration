"use client";

import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";

export default function ActivitySidebar() {
    const { activities, members } = useBoard();
    const [isOpen, setIsOpen] = useState(true);

    // Helper relative time formatting
    const formatTime = (isoString) => {
        const diffMs = Date.now() - new Date(isoString).getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);

        if (diffSec < 10) return "Just now";
        if (diffSec < 60) return `${diffSec}s ago`;
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHour < 24) return `${diffHour}h ago`;
        return new Date(isoString).toLocaleDateString();
    };

    const getActionColor = (action) => {
        switch (action) {
            case "created_task": return "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30";
            case "moved_task": return "text-blue-400 bg-blue-500/10 border-blue-500/30";
            case "deleted_task": return "text-rose-450 bg-rose-500/10 border-rose-500/30";
            case "added_comment": return "text-purple-400 bg-purple-500/10 border-purple-500/30";
            default: return "text-slate-400 bg-slate-800 border-slate-700/60";
        }
    };

    return (
        <div
            className={`h-full border-l border-dark-border bg-[#090e1a]/95 flex flex-col transition-technical select-none relative ${isOpen ? "w-80" : "w-12"
                }`}
        >
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -left-3 top-5 w-6 h-6 bg-dark-surface border border-dark-border hover:border-brand-emerald/50 rounded-full flex items-center justify-center text-slate-350 hover:text-white cursor-pointer z-10"
            >
                <svg
                    className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {isOpen ? (
                <>
                    {/* Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border">
                        <span className="font-bold text-sm tracking-wider text-white uppercase flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activity Simulator Log
                        </span>
                        <span className="text-[10px] font-bold bg-slate-900 border border-dark-border text-slate-400 px-2 py-0.5 rounded-sm">
                            Live
                        </span>
                    </div>

                    {/* Activities list */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {activities.length === 0 ? (
                            <div className="text-center text-xs text-slate-500 py-10 font-semibold">
                                No activity logged yet.
                            </div>
                        ) : (
                            activities.map((act) => {
                                const user = members.find(m => m.id === act.userId);

                                return (
                                    <div key={act.id} className="text-xs border-b border-dark-border/30 pb-3 last:border-0">
                                        <div className="flex items-center gap-2 mb-1.5 justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-5 h-5 flex items-center justify-center font-bold text-[8px] rounded-sm ${user ? user.color : 'bg-slate-800 text-slate-400'}`}>
                                                    {user ? user.initials : '?'}
                                                </span>
                                                <span className="font-bold text-slate-350">
                                                    {user ? user.name.split(" ")[0] : "System"}
                                                </span>
                                            </div>

                                            <span className="text-[9px] text-slate-500 font-semibold">
                                                {formatTime(act.date)}
                                            </span>
                                        </div>

                                        <p className="text-slate-400 pl-6 leading-relaxed">
                                            <span className={`inline-block px-1 py-0.5 rounded-sm border text-[9px] uppercase tracking-wide mr-1 font-bold ${getActionColor(act.action)}`}>
                                                {act.action.replace("_", " ")}
                                            </span>
                                            {act.details}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            ) : (
                /* Collapsed minimal vertical bar indicators */
                <div className="h-full flex flex-col items-center py-16 gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></div>
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest [writing-mode:vertical-lr] my-1 inline-block">
                        ACTIVITIES
                    </span>
                </div>
            )}
        </div>
    );
}
