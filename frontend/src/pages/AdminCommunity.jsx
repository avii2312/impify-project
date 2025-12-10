import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { MessageSquare, Users, ThumbsUp, Flag, Search, CheckCircle, X, Eye, AlertTriangle, Clock, MoreVertical } from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { Button } from '@/components/ui/button';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} w-fit mb-4`}><Icon size={22} className="text-white" /></div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-white/50">{label}</p>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const config = {
    published: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    flagged: { bg: 'bg-red-500/10', text: 'text-red-400' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    removed: { bg: 'bg-slate-500/10', text: 'text-slate-400' }
  };
  const { bg, text } = config[status] || config.pending;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
};

const PostCard = ({ post, onAction, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-2xl backdrop-blur-xl border transition-all ${post.status === 'flagged' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/50 border-white/[0.08] hover:border-white/20'}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
          {(post.author || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-white">{post.author || 'Unknown'}</span>
            <StatusBadge status={post.status} />
            {post.status === 'flagged' && <span className="flex items-center gap-1 text-xs text-red-400"><AlertTriangle size={12} />Needs review</span>}
          </div>
          <p className="text-white/70 mb-3">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><ThumbsUp size={12} />{post.likes || 0}</span>
            <span className="flex items-center gap-1"><MessageSquare size={12} />{post.comments || 0}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{formatDate(post.created_at)}</span>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <MoreVertical size={18} className="text-white/50" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 py-2 w-40 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-10"
              >
                <button onClick={() => { onAction(post.id, 'view'); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/10">
                  <Eye size={14} />View
                </button>
                {post.status === 'flagged' && (
                  <>
                    <button onClick={() => { onAction(post.id, 'approve'); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10">
                      <CheckCircle size={14} />Approve
                    </button>
                    <button onClick={() => { onAction(post.id, 'remove'); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10">
                      <X size={14} />Remove
                    </button>
                  </>
                )}
                {post.status !== 'flagged' && (
                  <button onClick={() => { onAction(post.id, 'flag'); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:bg-amber-500/10">
                    <Flag size={14} />Flag
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminCommunity({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({ total: 0, likes: 0, active: 0, flagged: 0 });

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const [postsRes, statsRes] = await Promise.all([
        adminAPI.getCommunityPosts(),
        adminAPI.getCommunityStats()
      ]);
      const postsList = postsRes.data?.posts || [];
      setPosts(postsList);
      setStats(statsRes.data || { total_posts: postsList.length, total_likes: 0, active_users: 0, flagged_posts: postsList.filter(p => p.status === 'flagged').length });
    } catch (error) { console.error('Error:', error); toast.error('Failed to load posts'); }
    finally { setLoading(false); }
  };

  const handleAction = async (postId, action) => {
    if (action === 'view') {
      toast.info('Post details modal coming soon');
      return;
    }
    try {
      await adminAPI.moderatePost(postId, action);
      toast.success(`Post ${action === 'approve' ? 'approved' : action === 'remove' ? 'removed' : 'flagged'}`);
      fetchPosts();
    } catch (error) { toast.error(`Failed to ${action} post`); }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchTerm || p.content?.toLowerCase().includes(searchTerm.toLowerCase()) || p.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const flaggedCount = posts.filter(p => p.status === 'flagged').length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/10 via-transparent to-transparent" /></div>
      <AdminSidebar onLogout={handleLogout} />
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500"><MessageSquare size={28} className="text-white" /></div>
              <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Community</h1><p className="text-white/50 mt-1">Moderate posts and discussions</p></div>
            </div>
            {flaggedCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={18} className="text-red-400" />
                <span className="text-red-400 font-medium">{flaggedCount} posts need review</span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={MessageSquare} label="Total Posts" value={stats.total_posts || posts.length} color="from-pink-500 to-rose-500" />
            <StatCard icon={ThumbsUp} label="Total Likes" value={stats.total_likes || 0} color="from-blue-500 to-cyan-500" />
            <StatCard icon={Users} label="Active Users" value={stats.active_users || 0} color="from-emerald-500 to-teal-500" />
            <StatCard icon={Flag} label="Flagged" value={stats.flagged_posts || flaggedCount} color="from-red-500 to-orange-500" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-colors" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-pink-500/50">
                <option value="all">All Status</option><option value="published">Published</option><option value="flagged">Flagged</option><option value="pending">Pending</option><option value="removed">Removed</option>
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-pink-500/30 border-t-pink-500 rounded-full" /></div>
          ) : filteredPosts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/50 border border-white/[0.08]">
              <MessageSquare size={48} className="text-white/20 mb-4" />
              <p className="text-white/40">{searchTerm || filterStatus !== 'all' ? 'No posts found' : 'No community posts yet'}</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} onAction={handleAction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
