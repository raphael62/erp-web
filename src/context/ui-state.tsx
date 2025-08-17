"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type UIStateContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("isSidebarOpen");
    if (saved !== null) setIsSidebarOpen(saved === "true");
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", String(isSidebarOpen));
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(v => !v);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <UIStateContext.Provider value={{ isSidebarOpen, toggleSidebar, openSidebar, closeSidebar }}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const ctx = useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within a UIStateProvider");
  return ctx;
}

