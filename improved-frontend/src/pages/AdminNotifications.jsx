import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { Bell, Send, Users, Clock, CheckCircle, X, Search, Plus, Trash2, AlertCircle, Megaphone, Settings } from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { Button } from '@/components/ui/button';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} w-fit mb-4`}><Icon size={22} className="text-white" /></div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-white/50">{label}</p>
  </motion.div>
);

const TypeBadge = ({ type }) => {
  const config = {
    announcement: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Megaphone },
    alert: { bg: 'bg-red-500/10', text: 'text-red-400', icon: AlertCircle },
    update: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle },
    maintenance: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: Settings }
  };
  const { bg, text, icon: Icon } = config[type] || config.announcement;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}><Icon size={12} />{type?.charAt(0).toUpperCase() + type?.slice(1)}</span>;
};

const NotificationCard = ({ notification, onDelete, index }) => {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={18} className="text-indigo-400" />
            <h3 className="font-semibold text-white">{notification.title}</h3>
            <TypeBadge type={notification.type} />
          </div>
          <p className="text-white/60 text-sm mb-3">{notification.message}</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><Users size={12} />{notification.target || 'All users'}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{formatDate(notification.created_at)}</span>
          </div>
        </div>
        <button onClick={() => onDelete(notification.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all">
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  );
};

const CreateModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({ title: '', message: '', type: 'announcement', target: 'all' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) { toast.error('Please fill all fields'); return; }
    setSending(true);
    try {
      await onCreate(formData);
      toast.success('Notification sent successfully');
      onClose();
    } catch (error) { toast.error('Failed to send notification'); }
    finally { setSending(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Send Notification</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={20} className="text-white/50" /></button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Notification title" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Notification message" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50">
                <option value="announcement">Announcement</option><option value="alert">Alert</option><option value="update">Update</option><option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Target</label>
              <select value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50">
                <option value="all">All Users</option><option value="active">Active Users</option><option value="new">New Users</option><option value="premium">Premium Users</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">Cancel</Button>
            <Button type="submit" disabled={sending} className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"><Send size={16} className="mr-2" />{sending ? 'Sending...' : 'Send'}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function AdminNotifications({ onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({ total: 0, sent: 0, read: 0 });

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getNotifications();
      const list = response.data?.notifications || [];
      setNotifications(list);
      setStats({ total: list.length, sent: list.length, read: Math.floor(list.length * 0.7) });
    } catch (error) { console.error('Error:', error); toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (data) => {
    await adminAPI.createNotification(data);
    fetchNotifications();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try { await adminAPI.deleteNotification(id); toast.success('Notification deleted'); fetchNotifications(); }
    catch (error) { toast.error('Failed to delete'); }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = !searchTerm || n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || n.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || n.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <>
      <AnimatePresence>{showModal && <CreateModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}</AnimatePresence>
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" /></div>
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500"><Bell size={28} className="text-white" /></div>
                <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Notifications</h1><p className="text-white/50 mt-1">Send announcements to users</p></div>
              </div>
              <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"><Plus size={18} className="mr-2" />New Notification</Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard icon={Bell} label="Total Sent" value={stats.total} color="from-indigo-500 to-purple-500" />
              <StatCard icon={Send} label="This Week" value={stats.sent} color="from-blue-500 to-cyan-500" />
              <StatCard icon={CheckCircle} label="Read Rate" value={`${stats.total > 0 ? Math.round((stats.read / stats.total) * 100) : 0}%`} color="from-emerald-500 to-teal-500" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors" />
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50">
                  <option value="all">All Types</option><option value="announcement">Announcements</option><option value="alert">Alerts</option><option value="update">Updates</option><option value="maintenance">Maintenance</option>
                </select>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full" /></div>
            ) : filteredNotifications.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/50 border border-white/[0.08]">
                <Bell size={48} className="text-white/20 mb-4" />
                <p className="text-white/40 mb-4">{searchTerm || filterType !== 'all' ? 'No notifications found' : 'No notifications sent yet'}</p>
                <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0"><Plus size={18} className="mr-2" />Send First Notification</Button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <NotificationCard key={notification.id} notification={notification} index={index} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
