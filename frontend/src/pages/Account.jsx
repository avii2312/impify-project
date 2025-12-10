import React from "react";
import { motion } from "framer-motion";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Account = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground app-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 max-w-lg mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <div className="space-y-4">

          {/* USER INFO */}
          <div className="glass-card p-4">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <p className="text-muted">Update your login info, name, and preferences.</p>
          </div>

          {/* THEME TOGGLE */}
          <button
            className="glass-card p-4 w-full flex justify-between items-center"
            onClick={toggleTheme}
          >
            <span className="font-medium">Toggle Theme</span>
            <div className="p-2 bg-card rounded-lg">
              {theme === "dark" ? (
                <Sun />
              ) : (
                <Moon />
              )}
            </div>
          </button>

          {/* LOGOUT */}
          <button
            className="glass-card p-4 w-full flex justify-between items-center text-red-400"
            onClick={onLogout}
          >
            <span className="font-medium">Log Out</span>
            <LogOut />
          </button>

        </div>
      </motion.div>
    </div>
  );
};

export default Account;