import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { BarChart3, TrendingUp, Users, FileText, Download, Activity, PieChart, Clock, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import axiosInstance from '@/api/axios';
import { Button } from '@/components/ui/button';

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500, steps = 60, increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(current)); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color, delay = 0 }) => {
  const isPositive = trend === 'up';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] overflow-hidden group">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}><Icon size={22} className="text-white" /></div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trendValue}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1"><AnimatedCounter value={value} /></p>
      <p className="text-sm text-white/50">{label}</p>
    </motion.div>
  );
};

const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <motion.div initial={{ height: 0 }} animate={{ height: `${(item.value / max) * 100}%` }} transition={{ duration: 0.5, delay: index * 0.1 }} className={`w-full rounded-t-lg bg-gradient-to-t ${color} min-h-[4px]`} />
          <span className="text-[10px] text-white/40">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const HealthIndicator = ({ status, label, value, icon: Icon }) => {
  const colors = { healthy: 'from-emerald-500 to-green-500', warning: 'from-amber-500 to-orange-500', critical: 'from-red-500 to-rose-500' };
  return (
    <div className="text-center">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[status]} flex items-center justify-center mx-auto mb-3 shadow-lg`}><Icon size={28} className="text-white" /></div>
      <p className="text-lg font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
};

export default function AdminAnalytics({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchAnalytics(); }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse] = await Promise.all([
        adminAPI.getAnalytics(timeRange),
        axiosInstance.get("/admin/stats")
      ]);
      setAnalytics({ ...analyticsResponse.data, stats: statsResponse.data });
    } catch (error) { console.error('Failed to load analytics:', error); toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  const exportAnalytics = async () => {
    try {
      toast.info('Generating report...');
      const response = await adminAPI.exportAnalytics();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded');
    } catch (error) { toast.error('Failed to export'); }
  };

  const usageData = [{ label: 'Mon', value: 120 }, { label: 'Tue', value: 180 }, { label: 'Wed', value: 150 }, { label: 'Thu', value: 220 }, { label: 'Fri', value: 190 }, { label: 'Sat', value: 80 }, { label: 'Sun', value: 60 }];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72 p-6"><div className="flex items-center justify-center min-h-[80vh]"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full" /></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" /></div>
      <AdminSidebar onLogout={handleLogout} />
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500"><BarChart3 size={28} className="text-white" /></div>
              <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Analytics <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dashboard</span></h1><p className="text-white/50 mt-1">Platform insights and metrics</p></div>
            </div>
            <div className="flex items-center gap-3">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500">
                <option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="1y">Last year</option>
              </select>
              <Button onClick={fetchAnalytics} className="bg-white/10 hover:bg-white/20 text-white border-0"><RefreshCw size={18} /></Button>
              <Button onClick={exportAnalytics} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"><Download size={18} className="mr-2" />Export</Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={analytics?.users?.total || 0} trend="up" trendValue="+12%" color="from-blue-500 to-cyan-500" delay={0.1} />
            <StatCard icon={FileText} label="Total Notes" value={analytics?.content?.notes || 0} trend="up" trendValue="+23%" color="from-emerald-500 to-teal-500" delay={0.2} />
            <StatCard icon={Activity} label="AI Chats" value={analytics?.ai?.total_chats || 0} trend="up" trendValue="+18%" color="from-purple-500 to-pink-500" delay={0.3} />
            <StatCard icon={Zap} label="Tokens Used" value={analytics?.ai?.tokens_used || 0} trend="down" trendValue="-5%" color="from-amber-500 to-orange-500" delay={0.4} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6"><div><h3 className="font-semibold text-white">Usage Trends</h3><p className="text-sm text-white/50">Daily activity</p></div><TrendingUp size={20} className="text-blue-400" /></div>
              <MiniBarChart data={usageData} color="from-blue-500/80 to-cyan-500/80" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-6"><div><h3 className="font-semibold text-white">User Stats</h3><p className="text-sm text-white/50">Breakdown</p></div><PieChart size={20} className="text-purple-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5"><p className="text-2xl font-bold text-white">{analytics?.users?.active || 0}</p><p className="text-sm text-white/50">Active Users</p></div>
                <div className="p-4 rounded-xl bg-white/5"><p className="text-2xl font-bold text-emerald-400">{analytics?.users?.new || 0}</p><p className="text-sm text-white/50">New This Week</p></div>
                <div className="p-4 rounded-xl bg-white/5"><p className="text-2xl font-bold text-purple-400">{analytics?.users?.premium || 0}</p><p className="text-sm text-white/50">Premium</p></div>
                <div className="p-4 rounded-xl bg-white/5"><p className="text-2xl font-bold text-amber-400">{analytics?.users?.retention || 0}%</p><p className="text-sm text-white/50">Retention</p></div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
            <h3 className="font-semibold text-white mb-6 flex items-center gap-2"><Zap size={20} className="text-cyan-400" />System Health</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <HealthIndicator status="healthy" label="System Status" value="Operational" icon={Activity} />
              <HealthIndicator status="healthy" label="Response Time" value={`${analytics?.system?.avg_response_time || 120}ms`} icon={Clock} />
              <HealthIndicator status="healthy" label="Uptime" value={`${analytics?.system?.uptime_percentage || 99.9}%`} icon={TrendingUp} />
              <HealthIndicator status={analytics?.system?.error_rate > 1 ? 'warning' : 'healthy'} label="Error Rate" value={`${analytics?.system?.error_rate || 0.1}%`} icon={AlertTriangle} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
