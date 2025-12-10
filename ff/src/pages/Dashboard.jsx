import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";

import {
  Bell,
  User,
  LogOut,
  Sparkles,
  FileText,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FancyDropzone from "@/components/FancyDropzone";
import { RecentNotesStack } from "@/components/ui/RecentNotesStack";
import { RecentFlashcardsStack } from "@/components/ui/RecentFlashcardsStack";
import StatsRow from "@/components/dashboard/StatsRow";
import { useFileUpload } from "@/hooks/useFileUpload";
import DashboardHeader from "@/components/gamify/DashboardHeader";


// --------------------------------------------------
// Dashboard V2 — Premium Glass / Bento / Vision UI
// --------------------------------------------------

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { dashboardStats, recentNotes, recentFlashcards, recentActivity, refreshData, tokenInfo, showLevelUpAnimation } = useDashboardData();
  const { uploadFile, uploading, progress } = useFileUpload();
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    const success = await uploadFile(file, "general");
    if (success) {
      // Refresh dashboard data after successful upload
      setTimeout(() => {
        refreshData();
      }, 2000); // Wait 2 seconds for backend processing
    }
  };

  const handleFileSelect = (file) => {
    handleFileUpload(file);
  };


 
  
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">

      {/* ------------------------- */}
      {/* Optimized Background Glow  */}
      {/* ------------------------- */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
        <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
      </div>

      {/* ------------------------- */}
      {/* Page Container */}
      {/* ------------------------- */}
      <div className="px-4 sm:px-6 md:px-14 pt-8 md:pt-10 pb-0 relative">

        {/* ------------------------- */}
        {/* Header */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10"
        >
          {/* Branding */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
              Hello,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.name || "User"}
              </span>
              <span className="inline-block ml-2">
                👋
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl mt-2 text-sm sm:text-base">
              Focus on Learning. Let AI Handle the Rest.
            </p>
          </div>

          {/* Icons */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
            <Button
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 touch-manipulation"
              onClick={() => navigate('/notifications')}
            >
              <Bell size={18} className="sm:w-5 sm:h-5" />
            </Button>

            {/* Profile button → opens modal in future */}
            <Button
              size="icon"
              className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 touch-manipulation"
              onClick={() => logout('Logged out successfully')}
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </Button>
          </div>
        </motion.div>

        {/* ------------------------- */}
        {/* Gamification Header */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8"
        >
          <DashboardHeader
            stats={{
              tokens: tokenInfo?.current_tokens || 0,
              monthly_tokens: tokenInfo?.monthly_tokens_remaining || 0,
              days_until_reset: tokenInfo?.days_until_reset || 0,
              streak: tokenInfo?.streak_days || 0,
              xp: tokenInfo?.xp || 0,
              level: tokenInfo?.level || 1,
              is_premium: tokenInfo?.subscription?.tier === 'premium' || false,
              subscription: tokenInfo?.subscription
            }}
            showLevelUpAnimation={showLevelUpAnimation}
          />
        </motion.div>

        {/* ------------------------- */}
        {/* Stats Row — Optimized */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <StatsRow stats={dashboardStats} />
        </motion.div>

        {/* ------------------------- */}
        {/* Upload Section */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12"
        >
          <FancyDropzone
            onFileSelect={handleFileSelect}
            uploading={uploading}
            progress={progress}
          />
        </motion.div>

  
       

        {/* ------------------------- */}
        {/* Recent Content (Notes & Flashcards) */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Recent Notes */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Recent Notes</h2>
              <RecentNotesStack
                notes={recentNotes.map(n => ({
                  id: n._id || n.id,
                  title: n.title,
                  preview: n.content?.slice(0, 180),
                  note_type: n.note_type
                }))}
              />
            </div>

            {/* Right Column - Recent Flashcards */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Recent Flashcards</h2>
              <RecentFlashcardsStack flashcards={recentFlashcards} />
            </div>
          </div>
        </motion.div>

        {/* ------------------------- */}
        {/* Recent Activity */}
        {/* ------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between py-3 border-b border-border last:border-none">
                <span className="text-foreground">{activity.title}</span>
                <span className="text-muted-foreground">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;
