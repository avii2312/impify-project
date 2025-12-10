import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/contexts/AuthContext";

import {
  Bell,
  LogOut,
  Sparkles,
  FileText,
  Plus,
  Zap,
  Flame,
  Trophy,
  Crown,
  TrendingUp,
  BookOpen,
  Brain,
  Target,
  ChevronRight,
  Upload,
  Clock,
  Star,
  ArrowUpRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import FancyDropzone from "@/components/FancyDropzone";
import { RecentNotesStack } from "@/components/ui/RecentNotesStack";
import { RecentFlashcardsStack } from "@/components/ui/RecentFlashcardsStack";
import { useFileUpload } from "@/hooks/useFileUpload";


// Animated counter component
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  React.useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

// Premium stat card with glassmorphism
const StatCard = ({ icon: Icon, label, value, subValue, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="group relative"
  >
    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
    <div className="relative h-full p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden">
      {/* Decorative corner */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={20} className="text-white" />
        </div>
        <ArrowUpRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-white tracking-tight">
          <AnimatedNumber value={value} />
        </p>
        <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</p>
        {subValue && (
          <p className="text-[10px] text-white/30 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  </motion.div>
);

// Gamification header with premium feel
const GamificationBar = ({ stats, onUpgrade }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="relative"
  >
    <div className="relative p-6 rounded-3xl bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-2xl border border-white/[0.08] overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-pink-500/10 animate-gradient-x" />

      {/* Decorative orbs */}
      <div className="absolute top-0 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        {/* Token Balance */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/30 rounded-2xl blur-lg animate-pulse" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Zap size={24} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{stats?.tokens || 0}</p>
            <p className="text-xs text-white/50">Tokens • {stats?.monthly_tokens || 0} monthly</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-lg" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500">
              <Flame size={24} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{stats?.streak || 0}</p>
            <p className="text-xs text-white/50">Day Streak</p>
          </div>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/30 rounded-2xl blur-lg" />
            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500">
              <Trophy size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-lg font-bold text-white">Level {stats?.level || 1}</p>
              <p className="text-xs text-white/50">{stats?.xp || 0} XP</p>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((stats?.xp || 0) % 100))}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Subscription Badge */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onUpgrade}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 border border-white/20">
            <Crown size={20} className="text-white" />
            <span className="text-sm font-semibold text-white capitalize">
              {stats?.subscription?.tier || 'Free'}
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Quick action card
const QuickAction = ({ icon: Icon, title, description, gradient, onClick, delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="group relative w-full text-left"
  >
    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
    <div className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-0.5">{title}</h3>
          <p className="text-xs text-white/50">{description}</p>
        </div>
        <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </motion.button>
);

// Activity item
const ActivityItem = ({ activity, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors group"
  >
    <div className="p-2 rounded-lg bg-white/5">
      <Clock size={16} className="text-white/50" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-white/80">{activity.title}</p>
    </div>
    <p className="text-xs text-white/30">{activity.timestamp}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { dashboardStats, recentNotes, recentFlashcards, recentActivity, refreshData, tokenInfo, showLevelUpAnimation } = useDashboardData();
  const { uploadFile, uploading, progress } = useFileUpload();
  const navigate = useNavigate();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleFileUpload = async (file) => {
    const success = await uploadFile(file, "general");
    if (success) {
      setTimeout(() => refreshData(), 2000);
    }
  };

  const stats = {
    tokens: tokenInfo?.current_tokens || 0,
    monthly_tokens: tokenInfo?.monthly_tokens_remaining || 0,
    days_until_reset: tokenInfo?.days_until_reset || 0,
    streak: tokenInfo?.streak_days || 0,
    xp: tokenInfo?.xp || 0,
    level: tokenInfo?.level || 1,
    subscription: tokenInfo?.subscription
  };


 
  
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Premium gradient mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-indigo-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-3xl animate-slow-spin" />
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 -z-5 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noise)"/%3E%3C/svg%3E")' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {user?.name || "User"}
              </span>
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block ml-3"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-white/50 mt-2 text-sm sm:text-base">
              Your AI-powered learning companion is ready
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/notifications')}
              className="relative p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Bell size={20} className="text-white/70" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => logout('Logged out successfully')}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
            >
              <LogOut size={20} className="text-white/70" />
            </motion.button>
          </div>
        </motion.header>

        {/* Gamification Bar */}
        <div className="mb-8">
          <GamificationBar stats={stats} onUpgrade={() => setShowSubscriptionModal(true)} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileText}
            label="Total Notes"
            value={dashboardStats?.notes || 0}
            gradient="from-blue-500 to-cyan-500"
            delay={0.1}
          />
          <StatCard
            icon={Brain}
            label="Flashcards"
            value={dashboardStats?.flashcards || 0}
            gradient="from-purple-500 to-pink-500"
            delay={0.2}
          />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={dashboardStats?.accuracy || 0}
            subValue="Based on reviews"
            gradient="from-green-500 to-emerald-500"
            delay={0.3}
          />
          <StatCard
            icon={TrendingUp}
            label="Uploads"
            value={dashboardStats?.uploads || 0}
            gradient="from-orange-500 to-red-500"
            delay={0.4}
          />
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <FancyDropzone
            onFileSelect={handleFileUpload}
            uploading={uploading}
            progress={progress}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAction
              icon={Upload}
              title="Upload Notes"
              description="Add new study material"
              gradient="from-blue-500 to-indigo-500"
              onClick={() => document.querySelector('.dropzone-input')?.click()}
              delay={0.1}
            />
            <QuickAction
              icon={Brain}
              title="Study Flashcards"
              description="Review your cards"
              gradient="from-purple-500 to-pink-500"
              onClick={() => navigate('/flashcards')}
              delay={0.2}
            />
            <QuickAction
              icon={Sparkles}
              title="AI Chat"
              description="Ask anything"
              gradient="from-emerald-500 to-teal-500"
              onClick={() => navigate('/chat')}
              delay={0.3}
            />
            <QuickAction
              icon={BookOpen}
              title="Analyze Paper"
              description="Question paper analysis"
              gradient="from-orange-500 to-red-500"
              onClick={() => navigate('/analysis')}
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Notes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Notes</h2>
              <button
                onClick={() => navigate('/notes')}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>
            <RecentNotesStack
              notes={recentNotes.map(n => ({
                id: n._id || n.id,
                title: n.title,
                preview: n.content?.slice(0, 180),
                note_type: n.note_type
              }))}
            />
          </motion.div>

          {/* Recent Flashcards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Flashcards</h2>
              <button
                onClick={() => navigate('/flashcards')}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={16} />
              </button>
            </div>
            <RecentFlashcardsStack flashcards={recentFlashcards} />
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] overflow-hidden">
            {recentActivity.length > 0 ? (
              <div className="divide-y divide-white/[0.05]">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Clock size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 60s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
