// src/theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children, initial = null }) => {
  const pref = localStorage.getItem("theme") || initial || "dark";
  const [theme, setTheme] = useState(pref);

  useEffect(() => {
    document.documentElement.classList.remove("light","dark");
    document.documentElement.classList.add(theme === "light" ? "light" : "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};