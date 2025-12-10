import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { AnimatedStat } from '@/components/ui/AnimatedStat';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload':
        return <FileText size={16} style={{ color: '#22c55e' }} />;
      case 'registration':
        return <Users size={16} style={{ color: '#3b82f6' }} />;
      default:
        return <Activity size={16} style={{ color: '#6b7280' }} />;
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-slate-900 text-white">
        {/* ------------------------- */}
        {/* Optimized Background Glow  */}
        {/* ------------------------- */}
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
          <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
        </div>

        <AdminSidebar onLogout={handleLogout} />

        <div className="pl-80 p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-slate-900 text-white">

      {/* ------------------------- */}
      {/* Optimized Background Glow  */}
      {/* ------------------------- */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
        <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <div className="pl-80 p-6">
        <div className="max-w-7xl mx-auto">
          {/* ------------------------- */}
          {/* Header */}
          {/* ------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-10"
          >
            {/* Branding */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                Admin{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl mt-2">
                System overview and analytics
              </p>
            </div>

            {/* Icons */}
            <div className="flex gap-3">
              <Button
                onClick={fetchDashboardData}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <RefreshCw size={20} className="mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* ------------------------- */}
          {/* Stats Row — Optimized */}
          {/* ------------------------- */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              <AnimatedStat
                label="Total Users"
                value={stats.total_users || 0}
                icon={Users}
              />

              <AnimatedStat
                label="Active Users"
                value={stats.active_users || 0}
                icon={Activity}
              />

              <AnimatedStat
                label="Total Notes"
                value={stats.total_notes || 0}
                icon={FileText}
              />

              <AnimatedStat
                label="Total Uploads"
                value={stats.total_uploads || 0}
                icon={TrendingUp}
              />
            </motion.div>
          )}

          {/* ------------------------- */}
          {/* Recent Activity */}
          {/* ------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              {(!recentActivity || recentActivity.length === 0) ? (
                <div className="text-center py-12">
                  <Activity size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex justify-between py-3 border-b border-border last:border-none">
                      <span className="text-foreground">{activity.description}</span>
                      <span className="text-muted-foreground">{formatDate(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}