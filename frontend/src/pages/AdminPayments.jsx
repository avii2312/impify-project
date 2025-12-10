import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { CreditCard, Download, Search, Filter, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Users, Calendar, ChevronLeft, ChevronRight, Eye, MoreVertical } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { Button } from '@/components/ui/button';
import { saveAs } from 'file-saver';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }) => {
  const isPositive = trend === 'up';
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}><Icon size={22} className="text-white" /></div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trendValue}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    failed: { bg: 'bg-red-500/10', text: 'text-red-400' },
    refunded: { bg: 'bg-blue-500/10', text: 'text-blue-400' }
  };
  const { bg, text } = config[status] || config.pending;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
};

export default function AdminPayments({ onLogout }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, avgTransaction: 0, totalTransactions: 0 });
  const paymentsPerPage = 10;

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/payments");
      const paymentsList = res.data.payments || [];
      setPayments(paymentsList);
      
      const total = paymentsList.reduce((sum, p) => sum + (p.amount_in_inr || 0), 0);
      const thisMonth = paymentsList.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + (p.amount_in_inr || 0), 0);
      setStats({
        total,
        thisMonth,
        avgTransaction: paymentsList.length > 0 ? Math.round(total / paymentsList.length) : 0,
        totalTransactions: paymentsList.length
      });
    } catch (error) { console.error('Error:', error); toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  const exportCsv = async () => {
    try {
      toast.info('Generating CSV...');
      const res = await axiosInstance.get("/admin/export/payments.csv", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `payments_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('CSV downloaded successfully');
    } catch (error) { toast.error('Failed to export CSV'); }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = !searchTerm || p.user_id?.toLowerCase().includes(searchTerm.toLowerCase()) || p.provider_payment_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * paymentsPerPage, currentPage * paymentsPerPage);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" /></div>
      <AdminSidebar onLogout={handleLogout} />
      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500"><CreditCard size={28} className="text-white" /></div>
              <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Payments</h1><p className="text-white/50 mt-1">Manage transactions and revenue</p></div>
            </div>
            <Button onClick={exportCsv} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"><Download size={18} className="mr-2" />Export CSV</Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.total.toLocaleString()}`} trend="up" trendValue="+18%" color="from-emerald-500 to-teal-500" />
            <StatCard icon={TrendingUp} label="This Month" value={`₹${stats.thisMonth.toLocaleString()}`} trend="up" trendValue="+12%" color="from-blue-500 to-cyan-500" />
            <StatCard icon={CreditCard} label="Avg Transaction" value={`₹${stats.avgTransaction.toLocaleString()}`} color="from-purple-500 to-pink-500" />
            <StatCard icon={Users} label="Total Transactions" value={stats.totalTransactions.toString()} trend="up" trendValue="+8%" color="from-amber-500 to-orange-500" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" placeholder="Search by user ID or payment ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-emerald-500/50">
                <option value="all">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
              </select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full" /></div>
            ) : paginatedPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20"><CreditCard size={48} className="text-white/20 mb-4" /><p className="text-white/40">No payments found</p></div>
            ) : (
              <>
                <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-sm font-medium text-white/50">
                  <div className="col-span-3">User ID</div><div className="col-span-3">Payment ID</div><div className="col-span-2">Provider</div><div className="col-span-2">Amount</div><div className="col-span-2">Date</div>
                </div>
                <div className="divide-y divide-white/[0.05]">
                  {paginatedPayments.map((payment, index) => (
                    <motion.div key={payment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                      <div className="lg:col-span-3"><p className="text-sm text-white truncate">{payment.user_id || '—'}</p></div>
                      <div className="lg:col-span-3"><p className="text-sm text-white/60 truncate">{payment.provider_payment_id}</p></div>
                      <div className="lg:col-span-2"><span className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/70">{payment.provider}</span></div>
                      <div className="lg:col-span-2"><p className="text-lg font-semibold text-emerald-400">₹{payment.amount_in_inr?.toLocaleString()}</p></div>
                      <div className="lg:col-span-2"><p className="text-sm text-white/40">{new Date(payment.created_at).toLocaleDateString()}</p></div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {totalPages > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mt-6">
              <p className="text-sm text-white/40">Showing {(currentPage - 1) * paymentsPerPage + 1} to {Math.min(currentPage * paymentsPerPage, filteredPayments.length)} of {filteredPayments.length}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-colors"><ChevronLeft size={18} className="text-white" /></button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 hover:bg-white/10 transition-colors"><ChevronRight size={18} className="text-white" /></button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
