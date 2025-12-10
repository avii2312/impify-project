import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Users,
  Mail,
  Calendar,
  Search,
  Filter,
  UserCheck,
  UserX,
  BarChart3,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminUsers({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      toast.success(`User ${status === 'active' ? 'activated' : 'deactivated'}`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const exportUsers = async () => {
    try {
      const response = await adminAPI.exportUsers();

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('User data exported successfully');
    } catch (error) {
      toast.error('Failed to export user data');
    }
  };


  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Suspended</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              <p className="text-muted-foreground">Loading users...</p>
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

      <div className="p-6">
        <div className="max-w-7xl mx-auto ml-80">
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
                User{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Management
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl mt-2">
                Manage registered users and their access
              </p>
            </div>

            {/* Icons */}
            <div className="flex gap-3">
              <Button
                onClick={exportUsers}
                className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <Download size={20} className="mr-2" />
                Export Users
              </Button>
            </div>
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
                      <Users size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_users}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <UserCheck size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.active_users}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_notes}</p>
                      <p className="text-sm text-muted-foreground">Total Notes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <UserX size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.inactive_users}</p>
                      <p className="text-sm text-muted-foreground">Inactive Users</p>
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
                      placeholder="Search users..."
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
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Registered Users</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {filteredUsers.length} Records
              </Badge>
            </div>

            {filteredUsers.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No users found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No registered users yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user, index) => (
                  <Card
                    key={user.id}
                    className="glass-card hover-lift cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Users size={18} className="text-blue-400" />
                            <CardTitle className="text-lg text-foreground">
                              {user.name || 'Anonymous'}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Mail size={14} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={14} className="text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Joined {formatDate(user.created_at)}
                            </p>
                          </div>
                          <div>
                            {getStatusBadge(user.status)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        {user.status === 'active' ? (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateUserStatus(user.id, 'inactive');
                            }}
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <UserX size={14} className="mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateUserStatus(user.id, 'active');
                            }}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <UserCheck size={14} className="mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          {/* User Detail Modal */}
          {selectedUser && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedUser(null)}
            >
              <Card
                className="glass-card max-w-md w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-foreground">
                        {selectedUser.name || 'Anonymous'}
                      </CardTitle>
                      <CardDescription>{selectedUser.email}</CardDescription>
                    </div>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">User ID</h4>
                    <p className="text-sm text-muted-foreground font-mono">{selectedUser.id}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Registration Date</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Account Status</h4>
                    <p className="text-sm text-muted-foreground">{selectedUser.status}</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    {selectedUser.status === 'active' ? (
                      <Button
                        onClick={() => updateUserStatus(selectedUser.id, 'inactive')}
                        variant="outline"
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                      >
                        <UserX size={16} className="mr-2" />
                        Deactivate User
                      </Button>
                    ) : (
                      <Button
                        onClick={() => updateUserStatus(selectedUser.id, 'active')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <UserCheck size={16} className="mr-2" />
                        Activate User
                      </Button>
                    )}
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