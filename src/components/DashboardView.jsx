"use client";

import React from "react";
import { useBoard } from "../context/BoardContext";

export default function DashboardView() {
    const { tasks, projects, members, activeProjectId, setView, setActiveProjectId } = useBoard();

    // Filter tasks based on active project
    const projectTasks = activeProjectId
        ? tasks.filter(t => t.projectId === activeProjectId)
        : tasks;

    // Calculate metrics
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.column === "done").length;
    const inProgressTasks = projectTasks.filter(t => t.column === "in_progress").length;
    const inReviewTasks = projectTasks.filter(t => t.column === "in_review").length;
    const todoTasks = projectTasks.filter(t => t.column === "todo").length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate high priority count
    const highPriorityTasks = projectTasks.filter(t => t.priority === "high" && t.column !== "done").length;

    // Member workloads
    const memberWorkload = members.map(m => {
        const assignedTasks = projectTasks.filter(t => t.assigneeId === m.id && t.column !== "done");
        return {
            name: m.name.split(" ")[0],
            count: assignedTasks.length,
            initials: m.initials,
            color: m.color
        };
    });

    // Calculate charts angles for visual representation (Radial gauge)
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionRate / 100) * circumference;

    return (
        <div className="flex-1 p-6 space-y-6 overflow-y-auto select-none">

            {/* Welcome & Fast Stats Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a1222] border border-dark-border p-6 rounded-sm glass-panel">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">
                        Welcome back, <span className="text-brand-emerald">Youssef</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Here is your workspace overview for the current {activeProjectId ? "project" : "workspace"}.
                    </p>
                </div>
                <button
                    onClick={() => setView("board")}
                    className="px-4 py-2 bg-brand-emerald text-dark-bg text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-brand-emerald/90 transition-technical cursor-pointer neon-glow-emerald"
                >
                    View Kanban Board
                </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total Tasks */}
                <div className="bg-[#0a0f1d] border border-dark-border p-4 rounded-sm hover:border-slate-800 transition-technical">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tasks</span>
                        <div className="text-brand-emerald">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2v3" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{totalTasks}</div>
                    <div className="text-[10px] text-slate-400 mt-1">tasks tracked on current project</div>
                </div>

                {/* Completion Rate */}
                <div className="bg-[#0a0f1d] border border-dark-border p-4 rounded-sm hover:border-slate-800 transition-technical">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completion Rate</span>
                        <div className="text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{completionRate}%</div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-sm mt-3 overflow-hidden border border-dark-border/40">
                        <div className="bg-brand-emerald h-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
                    </div>
                </div>

                {/* Active In Progress */}
                <div className="bg-[#0a0f1d] border border-dark-border p-4 rounded-sm hover:border-slate-800 transition-technical">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">In Progress</span>
                        <div className="text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{inProgressTasks}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{inReviewTasks} in review validation stage</div>
                </div>

                {/* High Risk Bottlenecks */}
                <div className="bg-[#0a0f1d] border border-dark-border p-4 rounded-sm hover:border-slate-800 transition-technical">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Urgent Action</span>
                        <div className="text-rose-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{highPriorityTasks}</div>
                    <div className="text-[10px] text-slate-400 mt-1">active high-priority pending tasks</div>
                </div>

            </div>

            {/* Main Charts & Analytics Partition */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Project Progress Circular Gauge */}
                <div className="bg-[#0a0f1d] border border-dark-border p-6 rounded-sm lg:col-span-1 flex flex-col justify-between items-center text-center">
                    <div className="w-full flex border-b border-dark-border/40 pb-3 justify-between items-center mb-4">
                        <span className="text-xs font-bold tracking-wider text-white uppercase">Project Progress Map</span>
                    </div>

                    <div className="relative flex items-center justify-center my-6">
                        {/* SVG Radial Progress */}
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className="stroke-slate-900 fill-none"
                                strokeWidth="11"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                className="stroke-brand-emerald fill-none transition-all duration-1000"
                                strokeWidth="11"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="square"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-extrabold text-white">{completionRate}%</span>
                            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-1">COMPLETED</span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-dark-border/40 text-left">
                        <div>
                            <span className="text-[10px] text-slate-500 font-bold block">COMPLETED</span>
                            <span className="text-sm font-bold text-white">{completedTasks} tasks</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 font-bold block">REMAINING</span>
                            <span className="text-sm font-bold text-white">{totalTasks - completedTasks} tasks</span>
                        </div>
                    </div>
                </div>

                {/* Task Columns Distribution Chart */}
                <div className="bg-[#0a0f1d] border border-dark-border p-6 rounded-sm lg:col-span-1 flex flex-col justify-between">
                    <div className="flex border-b border-dark-border/40 pb-3 justify-between items-center mb-4">
                        <span className="text-xs font-bold tracking-wider text-white uppercase">Task Stage Count</span>
                    </div>

                    {/* Simple Custom Vertical Bars Representation */}
                    <div className="flex items-end justify-around h-44 gap-2 pt-6">

                        {/* To Do Column */}
                        <div className="flex flex-col items-center flex-1 group">
                            <span className="text-[10px] font-bold text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{todoTasks}</span>
                            <div
                                className="w-full bg-slate-900 border border-dark-border hover:border-slate-700 transition-all rounded-sm flex items-end overflow-hidden"
                                style={{ height: "140px" }}
                            >
                                <div
                                    className="w-full bg-slate-800 transition-all duration-700"
                                    style={{ height: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-2">To Do</span>
                        </div>

                        {/* In Progress Column */}
                        <div className="flex flex-col items-center flex-1 group">
                            <span className="text-[10px] font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{inProgressTasks}</span>
                            <div
                                className="w-full bg-slate-900 border border-dark-border hover:border-slate-700 transition-all rounded-sm flex items-end overflow-hidden"
                                style={{ height: "140px" }}
                            >
                                <div
                                    className="w-full bg-amber-500/80 transition-all duration-700"
                                    style={{ height: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-2">Active</span>
                        </div>

                        {/* In Review Column */}
                        <div className="flex flex-col items-center flex-1 group">
                            <span className="text-[10px] font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{inReviewTasks}</span>
                            <div
                                className="w-full bg-slate-900 border border-dark-border hover:border-slate-700 transition-all rounded-sm flex items-end overflow-hidden"
                                style={{ height: "140px" }}
                            >
                                <div
                                    className="w-full bg-blue-500/80 transition-all duration-700"
                                    style={{ height: `${totalTasks > 0 ? (inReviewTasks / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-2">Review</span>
                        </div>

                        {/* Done Column */}
                        <div className="flex flex-col items-center flex-1 group">
                            <span className="text-[10px] font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{completedTasks}</span>
                            <div
                                className="w-full bg-slate-900 border border-dark-border hover:border-slate-700 transition-all rounded-sm flex items-end overflow-hidden"
                                style={{ height: "140px" }}
                            >
                                <div
                                    className="w-full bg-brand-emerald/80 transition-all duration-700"
                                    style={{ height: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-2">Done</span>
                        </div>

                    </div>

                    <div className="text-[10px] text-slate-500 font-semibold mt-4 text-center">
                        hover bars to inspect raw count parameters
                    </div>
                </div>

                {/* Team Workloads Panel */}
                <div className="bg-[#0a0f1d] border border-dark-border p-6 rounded-sm lg:col-span-1 flex flex-col justify-between">
                    <div className="flex border-b border-dark-border/40 pb-3 justify-between items-center mb-4">
                        <span className="text-xs font-bold tracking-wider text-white uppercase">Team Pending Tasks</span>
                    </div>

                    <div className="space-y-3.5 my-4">
                        {memberWorkload.map((mw, idx) => (
                            <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-5 h-5 flex items-center justify-center font-bold text-[8px] rounded-sm ${mw.color}`}>
                                            {mw.initials}
                                        </span>
                                        <span className="font-semibold text-slate-350">{mw.name}</span>
                                    </div>
                                    <span className="font-bold text-slate-400">{mw.count} tasks pending</span>
                                </div>
                                {/* Visual horizontal loading bar */}
                                <div className="w-full bg-slate-900 h-1.5 rounded-sm border border-dark-border/40 overflow-hidden">
                                    <div
                                        className="bg-brand-emerald h-full transition-all duration-500"
                                        style={{ width: `${totalTasks > 0 ? (mw.count / totalTasks) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-[10px] text-slate-500 font-semibold text-center border-t border-dark-border/40 pt-3">
                        Only pending columns (To Do, In Progress, In Review) are evaluated.
                    </div>
                </div>

            </div>

            {/* Projects Directory Details */}
            <div className="bg-[#0a0f1d] border border-dark-border p-5 rounded-sm">
                <h3 className="text-xs font-bold tracking-wider text-white uppercase border-b border-dark-border/40 pb-3 mb-3">
                    Workspace Projects Audit
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="text-slate-500 border-b border-dark-border/40">
                                <th className="pb-2 font-bold uppercase tracking-wider">Project Name</th>
                                <th className="pb-2 font-bold uppercase tracking-wider">Visual Key</th>
                                <th className="pb-2 font-bold uppercase tracking-wider">Status</th>
                                <th className="pb-2 font-bold uppercase tracking-wider">Overall Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((proj) => (
                                <tr
                                    key={proj.id}
                                    onClick={() => setActiveProjectId(proj.id)}
                                    className={`border-b border-dark-border/20 last:border-0 hover:bg-slate-800/20 cursor-pointer transition-colors ${activeProjectId === proj.id ? "bg-slate-800/10" : ""
                                        }`}
                                >
                                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full mr-1 ${proj.id === "proj-1" ? "bg-brand-emerald" : proj.id === "proj-2" ? "bg-blue-500" : "bg-amber-500"
                                            }`}></div>
                                        {proj.name}
                                    </td>
                                    <td className="py-3 font-mono text-slate-400">{proj.key}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wide ${proj.status === "Active"
                                                ? "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
                                                : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                                            }`}>
                                            {proj.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className="font-semibold text-white">{proj.progress}%</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
