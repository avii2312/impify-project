import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Bell,
  Send,
  Users,
  Clock,
  CheckCircle,
  X,
  Search,
  Filter,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminNotifications({ onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'announcement',
    target: 'all'
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await adminAPI.getNotifications();
      setNotifications(response.data?.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getNotificationStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const createNotification = async () => {
    try {
      await adminAPI.createNotification(newNotification);
      toast.success('Notification sent successfully');
      setShowCreateModal(false);
      setNewNotification({ title: '', message: '', type: 'announcement', target: 'all' });
      fetchNotifications();
      fetchStats();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await adminAPI.deleteNotification(id);
      toast.success('Notification deleted successfully');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'announcement':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Announcement</Badge>;
      case 'alert':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Alert</Badge>;
      case 'update':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Update</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Maintenance</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-60">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/30 blur-[160px] rounded-full -top-40 -left-20 animate-pulse-slow"></div>
          <div className="absolute w-[600px] h-[600px] bg-blue-600/40 blur-[190px] rounded-full bottom-10 right-0 animate-pulse-slower"></div>
        </div>

        <AdminSidebar onLogout={handleLogout} />

        <div className="pl-80 p-6">
          <div className="min-h-screen flex items-center justify-center">
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="spinner mb-4"></div>
              <p className="text-white/70">Loading notifications...</p>
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
            className="flex justify-between items-center mb-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center">
                <Bell size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Notification{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Center
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-2">
                  Send announcements and manage notifications
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
            >
              <Plus size={20} className="mr-2" />
              New Notification
            </Button>
          </motion.div>

          {/* Stats Cards */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Bell size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_sent}</p>
                      <p className="text-sm text-muted-foreground">Total Sent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.delivered}</p>
                      <p className="text-sm text-muted-foreground">Delivered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Clock size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.active_subscribers}</p>
                      <p className="text-sm text-muted-foreground">Subscribers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex gap-4 flex-wrap items-center">
                  <div className="flex items-center gap-2 flex-1 min-w-64">
                    <Search size={20} className="text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="announcement">Announcements</SelectItem>
                      <SelectItem value="alert">Alerts</SelectItem>
                      <SelectItem value="update">Updates</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {filteredNotifications.length} Items
              </Badge>
            </div>

            {filteredNotifications.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No notifications found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No notifications sent yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <Card key={notification.id} className="glass-card hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Bell size={18} className="text-blue-400" />
                            <CardTitle className="text-lg text-foreground">{notification.title}</CardTitle>
                            {getTypeBadge(notification.type)}
                          </div>
                          <p className="text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Sent to: {notification.target}</span>
                            <span>{formatDate(notification.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => deleteNotification(notification.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* Create Notification Modal */}
          {showCreateModal && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <Card
                className="glass-card max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <CardTitle className="text-foreground">Send New Notification</CardTitle>
                  <CardDescription>Create and send a notification to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                    <Input
                      placeholder="Notification title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                    <Textarea
                      placeholder="Notification message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      className="border-white/20 bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
                    <Select value={newNotification.type} onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}>
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Target Audience</label>
                    <Select value={newNotification.target} onValueChange={(value) => setNewNotification({ ...newNotification, target: value })}>
                      <SelectTrigger className="border-white/20 bg-white/5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active Users</SelectItem>
                        <SelectItem value="new">New Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowCreateModal(false)}
                      variant="outline"
                      className="border-white/20 text-foreground hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createNotification}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send size={16} className="mr-2" />
                      Send Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}