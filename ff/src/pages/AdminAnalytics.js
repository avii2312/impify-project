import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Calendar,
  Activity,
  PieChart,
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/api/axios';

export default function AdminAnalytics({ onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsResponse, statsResponse] = await Promise.all([
        adminAPI.getAnalytics(timeRange),
        axiosInstance.get("/admin/stats")
      ]);
      setAnalytics(analyticsResponse.data || {});
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setAnalytics({});
      setStats({});
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    try {
      const response = await adminAPI.exportAnalytics();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics data');
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
          <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
        </div>
        
        <AdminSidebar onLogout={handleLogout} />
        
        <div className="pl-80 p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="spinner mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
      </div>

      <AdminSidebar onLogout={handleLogout} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto ml-80">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-10 flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <BarChart3 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Analytics{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-2">
                  Comprehensive platform insights and metrics
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <button
                onClick={exportAnalytics}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/20 transition-all"
              >
                <Download size={16} className="mr-2 inline" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Key Metrics */}
          {analytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              {/* User Metrics */}
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} className="text-blue-400" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.users?.total || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{analytics.users?.active || 0}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-500">{analytics.users?.new || 0}</p>
                      <p className="text-sm text-muted-foreground">New Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">{analytics.users?.churn_rate || 0}%</p>
                      <p className="text-sm text-muted-foreground">Churn Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Metrics */}
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-green-400" />
                    Content Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.content?.total_notes || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Notes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">{analytics.content?.total_uploads || 0}</p>
                      <p className="text-sm text-muted-foreground">Uploads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-500">{analytics.content?.avg_processing_time || 0}s</p>
                      <p className="text-sm text-muted-foreground">Avg Processing</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{analytics.content?.ai_success_rate || 0}%</p>
                      <p className="text-sm text-muted-foreground">AI Success</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Metrics */}
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-yellow-400" />
                    Community Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.community?.total_posts || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{analytics.community?.total_likes || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">{analytics.community?.active_users || 0}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-500">{analytics.community?.flagged_posts || 0}</p>
                      <p className="text-sm text-muted-foreground">Flagged Posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Metrics */}
              <Card className="glass-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={20} className="text-red-400" />
                    Support Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{analytics.support?.total_tickets || 0}</p>
                      <p className="text-sm text-muted-foreground">Total Tickets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-500">{analytics.support?.open_tickets || 0}</p>
                      <p className="text-sm text-muted-foreground">Open Tickets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{analytics.support?.avg_resolution_time || 0}h</p>
                      <p className="text-sm text-muted-foreground">Avg Resolution</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-500">{analytics.support?.satisfaction_rate || 0}%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Performance Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={24} className="text-blue-500" />
                  AI Usage Trends
                </CardTitle>
                <CardDescription>AI chat and token usage over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.usage_trends || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff20' }} />
                    <Line type="monotone" dataKey="chats" stroke="#3b82f6" strokeWidth={2} name="Chats" />
                    <Line type="monotone" dataKey="tokens_used" stroke="#10b981" strokeWidth={2} name="Tokens Used" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart size={24} className="text-green-500" />
                  Category Distribution
                </CardTitle>
                <CardDescription>Breakdown of content and support categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 rounded-xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <PieChart size={48} className="text-emerald-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Category breakdown charts</p>
                    <p className="text-sm text-muted-foreground">Showing distribution of notes, tickets, and community posts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap size={24} className="text-cyan-400" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time system performance and health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <Activity size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">System Status</h3>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Operational</Badge>
                    <p className="text-sm text-muted-foreground mt-2">All systems running normally</p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <Clock size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Response Time</h3>
                    <p className="text-2xl font-bold text-blue-500">{analytics?.system?.avg_response_time || 0}ms</p>
                    <p className="text-sm text-muted-foreground">Average API response time</p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <TrendingUp size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Uptime</h3>
                    <p className="text-2xl font-bold text-yellow-500">{analytics?.system?.uptime_percentage || 0}%</p>
                    <p className="text-sm text-muted-foreground">System availability</p>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                      <AlertTriangle size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Error Rate</h3>
                    <p className="text-2xl font-bold text-red-500">{analytics?.system?.error_rate || 0}%</p>
                    <p className="text-sm text-muted-foreground">API error percentage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}