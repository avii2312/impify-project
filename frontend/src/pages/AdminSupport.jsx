import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { LifeBuoy, Search, Clock, CheckCircle, AlertCircle, User, MessageSquare, Send, Eye, X, ChevronRight } from 'lucide-react';
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
    open: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    in_progress: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    resolved: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    closed: { bg: 'bg-slate-500/10', text: 'text-slate-400' }
  };
  const { bg, text } = config[status] || config.open;
  const label = status?.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{label}</span>;
};

const PriorityBadge = ({ priority }) => {
  const config = {
    low: { bg: 'bg-slate-500/10', text: 'text-slate-400' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    high: { bg: 'bg-red-500/10', text: 'text-red-400' },
    urgent: { bg: 'bg-red-600/10', text: 'text-red-500' }
  };
  const { bg, text } = config[priority] || config.low;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{priority?.charAt(0).toUpperCase() + priority?.slice(1)}</span>;
};

const TicketCard = ({ ticket, onClick, index }) => {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="p-5 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-white">{ticket.subject}</h3>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <p className="text-white/50 text-sm mb-3 line-clamp-2">{ticket.description}</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1"><User size={12} />{ticket.user || 'Unknown'}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{formatDate(ticket.created_at)}</span>
            <span className="flex items-center gap-1"><MessageSquare size={12} />{ticket.replies || 0} replies</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
    </motion.div>
  );
};

const TicketModal = ({ ticket, onClose, onUpdate }) => {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await adminAPI.addTicketReply(ticket.id, replyText);
      toast.success('Reply sent');
      setReplyText('');
      onUpdate();
    } catch (error) { toast.error('Failed to send reply'); }
    finally { setSending(false); }
  };

  const handleStatusChange = async (status) => {
    try {
      await adminAPI.updateTicketStatus(ticket.id, status);
      toast.success('Status updated');
      onUpdate();
    } catch (error) { toast.error('Failed to update status'); }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-slate-900 border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{ticket.subject}</h3>
              <div className="flex items-center gap-3">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="text-xs text-white/40">From {ticket.user}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={20} className="text-white/50" /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-white/50 mb-2">Description</h4>
            <p className="text-white/80">{ticket.description}</p>
          </div>

          {ticket.replies_list && ticket.replies_list.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/50 mb-3">Conversation</h4>
              <div className="space-y-3">
                {ticket.replies_list.map((reply, index) => (
                  <div key={index} className={`p-4 rounded-xl ${reply.is_admin ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-white/5'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white">{reply.author}</span>
                      {reply.is_admin && <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400">Admin</span>}
                      <span className="text-xs text-white/40">{formatDate(reply.created_at)}</span>
                    </div>
                    <p className="text-white/70 text-sm">{reply.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-white/50 mb-2">Reply</h4>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {ticket.status === 'open' && (
              <Button onClick={() => handleStatusChange('in_progress')} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20">Start Working</Button>
            )}
            {ticket.status === 'in_progress' && (
              <Button onClick={() => handleStatusChange('resolved')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"><CheckCircle size={16} className="mr-2" />Mark Resolved</Button>
            )}
            <div className="flex-1" />
            <Button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white border-0">Close</Button>
            <Button onClick={handleReply} disabled={!replyText.trim() || sending} className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0">
              <Send size={16} className="mr-2" />{sending ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AdminSupport({ onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, avgTime: 0 });

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes] = await Promise.all([
        adminAPI.getSupportTickets(),
        adminAPI.getSupportStats()
      ]);
      const list = ticketsRes.data?.tickets || [];
      setTickets(list);
      setStats(statsRes.data || { total_tickets: list.length, open_tickets: list.filter(t => t.status === 'open').length, avg_resolution_time: 24, satisfaction_rate: 95 });
    } catch (error) { console.error('Error:', error); toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = !searchTerm || t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || t.user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <>
      <AnimatePresence>
        {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} onUpdate={() => { fetchTickets(); setSelectedTicket(null); }} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" /></div>
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500"><LifeBuoy size={28} className="text-white" /></div>
                <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Support</h1><p className="text-white/50 mt-1">Manage support tickets</p></div>
              </div>
              {openCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertCircle size={18} className="text-amber-400" />
                  <span className="text-amber-400 font-medium">{openCount} tickets need attention</span>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={LifeBuoy} label="Total Tickets" value={stats.total_tickets || tickets.length} color="from-teal-500 to-cyan-500" />
              <StatCard icon={AlertCircle} label="Open" value={stats.open_tickets || openCount} color="from-amber-500 to-orange-500" />
              <StatCard icon={Clock} label="Avg Resolution" value={`${stats.avg_resolution_time || 24}h`} color="from-blue-500 to-indigo-500" />
              <StatCard icon={CheckCircle} label="Satisfaction" value={`${stats.satisfaction_rate || 95}%`} color="from-emerald-500 to-teal-500" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" placeholder="Search tickets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 transition-colors" />
                </div>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-teal-500/50">
                  <option value="all">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option><option value="closed">Closed</option>
                </select>
              </div>
            </motion.div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-teal-500/30 border-t-teal-500 rounded-full" /></div>
            ) : filteredTickets.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/50 border border-white/[0.08]">
                <LifeBuoy size={48} className="text-white/20 mb-4" />
                <p className="text-white/40">{searchTerm || filterStatus !== 'all' ? 'No tickets found' : 'No support tickets yet'}</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket, index) => (
                  <TicketCard key={ticket.id} ticket={ticket} index={index} onClick={() => setSelectedTicket(ticket)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
