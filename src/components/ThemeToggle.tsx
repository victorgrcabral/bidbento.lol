"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

export type Theme = "dark" | "light";

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onThemeChange,
}) => {
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    onThemeChange(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900/90 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-all shadow-sm backdrop-blur-md cursor-pointer"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-violet-400" />
      )}
    </button>
  );
};
