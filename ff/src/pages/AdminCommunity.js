import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import {
  MessageSquare,
  Users,
  ThumbsUp,
  Flag,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  UserCheck
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminAPI } from '@/services/adminAPI';
import { motion } from 'framer-motion';

export default function AdminCommunity({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await adminAPI.getCommunityPosts();
      setPosts(response.data?.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
      toast.error('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getCommunityStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handlePostAction = async (postId, action) => {
    setActionLoading(true);
    try {
      await adminAPI.moderatePost(postId, action);
      toast.success(`Post ${action} successfully`);
      fetchPosts();
      fetchStats();
    } catch (error) {
      toast.error(`Failed to ${action} post`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Published</Badge>;
      case 'flagged':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Flagged</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
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
              <p className="text-white/70">Loading community posts...</p>
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
                <MessageSquare size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Community{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Management
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-2">
                  Moderate community posts and discussions
                </p>
              </div>
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
                      <MessageSquare size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_posts}</p>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <ThumbsUp size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total_likes}</p>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
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
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Flag size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.flagged_posts}</p>
                      <p className="text-sm text-muted-foreground">Flagged Posts</p>
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
                      placeholder="Search posts..."
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
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Posts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Community Posts</h2>
              <Badge className="bg-white/10 text-foreground border-white/20">
                {filteredPosts.length} Posts
              </Badge>
            </div>

            {filteredPosts.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={48} className="text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-lg text-foreground font-medium">No posts found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'No community posts yet'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <Card key={post.id} className="glass-card hover-lift">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <Users size={18} className="text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{post.author}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                            </div>
                          </div>
                          <p className="text-foreground mb-3">{post.content}</p>
                          <div className="flex items-center gap-4">
                            {getStatusBadge(post.status)}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <ThumbsUp size={16} />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare size={16} />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {post.status === 'flagged' && (
                            <>
                              <Button
                                onClick={() => handlePostAction(post.id, 'approve')}
                                disabled={actionLoading}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handlePostAction(post.id, 'remove')}
                                disabled={actionLoading}
                                size="sm"
                                variant="outline"
                                className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                              >
                                <X size={14} className="mr-1" />
                                Remove
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() => setSelectedPost(post)}
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-foreground hover:bg-white/5"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}