import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Users, FileText, TrendingUp, Activity, RefreshCw, DollarSign, Zap,
  ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal, Bell, Download, BarChart3
} from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { Button } from '@/components/ui/button';

const AnimatedCounter = ({ value, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color, delay = 0 }) => {
  const isPositive = trend === 'up';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      <div className="relative h-full p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon size={22} className="text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-3xl font-bold text-white tracking-tight mb-1"><AnimatedCounter value={value} /></p>
        <p className="text-sm text-white/50">{label}</p>
      </div>
    </motion.div>
  );
};

const MiniChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className={`flex-1 rounded-t bg-gradient-to-t ${color} min-h-[4px]`}
        />
      ))}
    </div>
  );
};

const ActivityItem = ({ activity, index }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'upload': return { icon: FileText, color: 'text-blue-400 bg-blue-400/10' };
      case 'registration': return { icon: Users, color: 'text-green-400 bg-green-400/10' };
      case 'payment': return { icon: DollarSign, color: 'text-amber-400 bg-amber-400/10' };
      default: return { icon: Activity, color: 'text-slate-400 bg-slate-400/10' };
    }
  };
  const { icon: Icon, color } = getIcon(activity.type);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative flex items-start gap-4 pb-6 last:pb-0"
    >
      <div className="absolute left-5 top-10 bottom-0 w-px bg-white/10 last:hidden" />
      <div className={`relative z-10 p-2.5 rounded-xl ${color}`}><Icon size={18} /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{activity.description}</p>
        <p className="text-xs text-white/40 mt-1">{activity.timestamp}</p>
      </div>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${color} text-white font-medium text-sm transition-all hover:shadow-lg w-full`}
  >
    <Icon size={18} />{label}
  </motion.button>
);

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchDashboardData(); }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getDashboardActivity()
      ]);
      setStats(statsResponse.data || {});
      setRecentActivity(activityResponse.data?.activities || []);
    } catch (error) {
      console.error('Dashboard error:', error);
      setStats({});
      setRecentActivity([]);
      toast.error('Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  const userChartData = [30, 45, 35, 50, 65, 55, 70];
  const revenueChartData = [100, 120, 90, 150, 130, 180, 200];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <AdminDock onLogout={handleLogout} />
        <div className="lg:pl-72 p-6">
          <div className="flex items-center justify-center min-h-[80vh]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Admin <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-white/50 mt-1">Welcome back! Here's what's happening.</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchDashboardData} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <RefreshCw size={20} className="text-white/70" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Bell size={20} className="text-white/70" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats?.total_users || 0} trend="up" trendValue="+12%" color="from-blue-500 to-cyan-500" delay={0.1} />
            <StatCard icon={Activity} label="Active Users" value={stats?.active_users || 0} trend="up" trendValue="+8%" color="from-green-500 to-emerald-500" delay={0.2} />
            <StatCard icon={FileText} label="Total Notes" value={stats?.total_notes || 0} trend="up" trendValue="+23%" color="from-purple-500 to-pink-500" delay={0.3} />
            <StatCard icon={DollarSign} label="Revenue" value={stats?.revenue || 0} trend="up" trendValue="+18%" color="from-amber-500 to-orange-500" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="font-semibold text-white">User Growth</h3><p className="text-sm text-white/50">Last 7 days</p></div>
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors"><MoreHorizontal size={18} className="text-white/40" /></button>
              </div>
              <MiniChart data={userChartData} color="from-blue-500/80 to-cyan-500/80" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-sm text-white/50">Total this week</span>
                <span className="text-lg font-semibold text-white">+{userChartData.reduce((a, b) => a + b, 0)}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="font-semibold text-white">Revenue</h3><p className="text-sm text-white/50">Last 7 days</p></div>
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors"><MoreHorizontal size={18} className="text-white/40" /></button>
              </div>
              <MiniChart data={revenueChartData} color="from-amber-500/80 to-orange-500/80" />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-sm text-white/50">Total this week</span>
                <span className="text-lg font-semibold text-white">₹{revenueChartData.reduce((a, b) => a + b, 0).toLocaleString()}</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Recent Activity</h3>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all</button>
              </div>
              {recentActivity.length > 0 ? (
                <div className="space-y-1">{recentActivity.slice(0, 5).map((activity, index) => (<ActivityItem key={index} activity={activity} index={index} />))}</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity size={40} className="text-white/20 mb-3" />
                  <p className="text-white/40 text-sm">No recent activity</p>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <h3 className="font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <QuickAction icon={Users} label="View All Users" onClick={() => window.location.href = '/admin/users'} color="from-blue-500 to-indigo-500" />
                <QuickAction icon={Bell} label="Send Notification" onClick={() => window.location.href = '/admin/notifications'} color="from-purple-500 to-pink-500" />
                <QuickAction icon={Download} label="Export Reports" onClick={() => toast.info('Generating report...')} color="from-emerald-500 to-teal-500" />
                <QuickAction icon={BarChart3} label="View Analytics" onClick={() => window.location.href = '/admin/analytics'} color="from-amber-500 to-orange-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
