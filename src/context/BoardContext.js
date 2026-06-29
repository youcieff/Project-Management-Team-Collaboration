"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_MEMBERS, INITIAL_ACTIVITIES } from "../data/mockData";

const BoardContext = createContext(undefined);

export function BoardProvider({ children }) {
  // Flag to ensure local storage only loads/saves on client side
  const [mounted, setMounted] = useState(false);
  
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("usr-1");
  
  // Views navigation state
  const [view, setView] = useState("dashboard"); // "dashboard" or "board"
  const [activeProjectId, setActiveProjectId] = useState(null); // null means All Projects

  // Active filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");

  // Load state on mount
  useEffect(() => {
    setMounted(true);
    
    const storedTasks = localStorage.getItem("fb_tasks");
    const storedProjects = localStorage.getItem("fb_projects");
    const storedMembers = localStorage.getItem("fb_members");
    const storedActivities = localStorage.getItem("fb_activities");
    const storedRole = localStorage.getItem("fb_active_role");

    setTasks(storedTasks ? JSON.parse(storedTasks) : MOCK_TASKS);
    setProjects(storedProjects ? JSON.parse(storedProjects) : MOCK_PROJECTS);
    setMembers(storedMembers ? JSON.parse(storedMembers) : MOCK_MEMBERS);
    setActivities(storedActivities ? JSON.parse(storedActivities) : INITIAL_ACTIVITIES);
    if (storedRole) setCurrentUserId(storedRole);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fb_tasks", JSON.stringify(tasks));
    localStorage.setItem("fb_projects", JSON.stringify(projects));
    localStorage.setItem("fb_members", JSON.stringify(members));
    localStorage.setItem("fb_activities", JSON.stringify(activities));
    localStorage.setItem("fb_active_role", currentUserId);
  }, [tasks, projects, members, activities, currentUserId, mounted]);

  // Compute active user
  const currentUser = members.find(m => m.id === currentUserId) || MOCK_MEMBERS[0];

  // Helper log activity
  const logActivity = (action, targetId, details) => {
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUserId,
      action,
      target: targetId,
      details,
      date: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Actions
  const changeUserRole = (userId) => {
    setCurrentUserId(userId);
    // Log role switch
    const userObj = members.find(m => m.id === userId);
    if (userObj) {
      logActivity("role_switch", userId, `Switched simulated identity to ${userObj.name} (${userObj.role})`);
    }
  };

  // Check if active user has permission to write/mutate state
  const hasEditPermission = () => {
    return currentUser.role !== "Viewer";
  };

  const moveTask = (taskId, newColumn) => {
    if (!hasEditPermission()) return false;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    const oldColumn = task.column;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, column: newColumn } : t));
    
    logActivity("moved_task", taskId, `Moved "${task.title}" from ${oldColumn.replace("_", " ")} to ${newColumn.replace("_", " ")}`);
    return true;
  };

  const addTask = (taskData) => {
    if (!hasEditPermission()) return false;

    const newTask = {
      id: `task-${Date.now()}`,
      projectId: activeProjectId || "proj-1", // default to first project if all is selected
      column: "todo",
      assigneeId: taskData.assigneeId || currentUserId,
      dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
      subtasks: taskData.subtasks || [],
      comments: [],
      createdAt: new Date().toISOString(),
      ...taskData
    };

    setTasks(prev => [newTask, ...prev]);
    logActivity("created_task", newTask.id, `Created task "${newTask.title}"`);
    return true;
  };

  const updateTask = (taskId, updatedFields) => {
    if (!hasEditPermission()) return false;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedFields } : t));
    logActivity("updated_task", taskId, `Updated details of "${task.title}"`);
    return true;
  };

  const deleteTask = (taskId) => {
    if (!hasEditPermission()) return false;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    setTasks(prev => prev.filter(t => t.id !== taskId));
    logActivity("deleted_task", taskId, `Deleted task "${task.title}"`);
    return true;
  };

  const toggleSubtask = (taskId, subtaskId) => {
    if (!hasEditPermission()) return false;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    const updatedSubtasks = task.subtasks.map(sub => {
      if (sub.id === subtaskId) {
        const nextState = !sub.completed;
        logActivity("toggle_subtask", taskId, `${nextState ? "Completed" : "Uncompleted"} subtask "${sub.title}" on "${task.title}"`);
        return { ...sub, completed: nextState };
      }
      return sub;
    });

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t));
    return true;
  };

  const addComment = (taskId, commentText) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    const newComment = {
      id: `comm-${Date.now()}`,
      userId: currentUserId,
      text: commentText,
      date: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment] } : t));
    logActivity("added_comment", taskId, `Commented on "${task.title}": "${commentText.substring(0, 30)}${commentText.length > 30 ? "..." : ""}"`);
    return true;
  };

  // Compute filtered tasks
  const filteredTasks = tasks.filter(t => {
    // Project filter
    if (activeProjectId && t.projectId !== activeProjectId) return false;
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description && t.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Priority filter
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

    // Member filter
    if (memberFilter !== "all" && t.assigneeId !== memberFilter) return false;

    return true;
  });

  return (
    <BoardContext.Provider value={{
      mounted,
      tasks,
      projects,
      members,
      activities,
      currentUserId,
      currentUser,
      view,
      setView,
      activeProjectId,
      setActiveProjectId,
      searchQuery,
      setSearchQuery,
      priorityFilter,
      setPriorityFilter,
      memberFilter,
      setMemberFilter,
      filteredTasks,
      
      changeUserRole,
      hasEditPermission,
      moveTask,
      addTask,
      updateTask,
      deleteTask,
      toggleSubtask,
      addComment
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}
