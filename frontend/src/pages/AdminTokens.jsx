import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { Coins, Plus, Edit, Trash2, Zap, Star, Crown, Gift, X, Save, Sparkles, TrendingUp, ShoppingCart } from 'lucide-react';
import axiosInstance from '@/api/axios';
import { Button } from '@/components/ui/button';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08]">
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} w-fit mb-4`}><Icon size={22} className="text-white" /></div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-white/50">{label}</p>
  </motion.div>
);

const TokenPackCard = ({ pack, onEdit, onDelete, index }) => {
  const gradients = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500'];
  const icons = [Zap, Star, Crown, Gift];
  const Icon = icons[index % icons.length];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -4, scale: 1.02 }} className="group relative">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
      <div className="relative p-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}><Icon size={24} className="text-white" /></div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(pack)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Edit size={16} className="text-white/50" /></button>
            <button onClick={() => onDelete(pack.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={16} className="text-red-400" /></button>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-white">₹{pack.price_in_inr}</span>
          <span className="text-white/40">INR</span>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
          <Coins size={20} className="text-amber-400" />
          <span className="text-lg font-semibold text-white">{pack.tokens?.toLocaleString()}</span>
          <span className="text-white/50">tokens</span>
        </div>
        {pack.bonus > 0 && (
          <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
            <Sparkles size={16} /><span>+{pack.bonus} bonus tokens</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TokenPackModal = ({ pack, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: pack?.name || '', tokens: pack?.tokens || 100, price_in_inr: pack?.price_in_inr || 99, bonus: pack?.bonus || 0 });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData, pack?.id);
      toast.success(pack ? 'Token pack updated' : 'Token pack created');
      onClose();
    } catch (error) { toast.error('Failed to save token pack'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{pack ? 'Edit Token Pack' : 'Create Token Pack'}</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={20} className="text-white/50" /></button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Pack Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Starter Pack" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Tokens</label>
              <input type="number" value={formData.tokens} onChange={(e) => setFormData({ ...formData, tokens: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Price (₹)</label>
              <input type="number" value={formData.price_in_inr} onChange={(e) => setFormData({ ...formData, price_in_inr: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bonus Tokens</label>
            <input type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: parseInt(e.target.value) || 0 })} placeholder="0" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"><Save size={16} className="mr-2" />{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function AdminTokens({ onLogout }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [stats, setStats] = useState({ totalSold: 0, revenue: 0, popularPack: '' });

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchPacks(); }, []);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/token-packs");
      setPacks(res.data.token_packs || []);
      setStats({ totalSold: 1250, revenue: 125000, popularPack: 'Pro Pack' });
    } catch (error) { console.error('Error:', error); toast.error('Failed to load token packs'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data, id) => {
    if (id) { await axiosInstance.put(`/admin/token-packs/${id}`, data); }
    else { await axiosInstance.post('/admin/token-packs', data); }
    fetchPacks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this token pack?')) return;
    try { await axiosInstance.delete(`/admin/token-packs/${id}`); toast.success('Token pack deleted'); fetchPacks(); }
    catch (error) { toast.error('Failed to delete token pack'); }
  };

  return (
    <>
      <AnimatePresence>{showModal && <TokenPackModal pack={editingPack} onClose={() => { setShowModal(false); setEditingPack(null); }} onSave={handleSave} />}</AnimatePresence>
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" /></div>
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500"><Coins size={28} className="text-white" /></div>
                <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Token Packs</h1><p className="text-white/50 mt-1">Manage token packages and pricing</p></div>
              </div>
              <Button onClick={() => { setEditingPack(null); setShowModal(true); }} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"><Plus size={18} className="mr-2" />Create Pack</Button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard icon={ShoppingCart} label="Total Sold" value={stats.totalSold.toLocaleString()} color="from-blue-500 to-cyan-500" />
              <StatCard icon={TrendingUp} label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="from-emerald-500 to-teal-500" />
              <StatCard icon={Star} label="Most Popular" value={stats.popularPack} color="from-purple-500 to-pink-500" />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full" /></div>
            ) : packs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 rounded-2xl bg-slate-900/50 border border-white/[0.08]">
                <Coins size={48} className="text-white/20 mb-4" />
                <p className="text-white/40 mb-4">No token packs yet</p>
                <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"><Plus size={18} className="mr-2" />Create First Pack</Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {packs.map((pack, index) => (
                  <TokenPackCard key={pack.id} pack={pack} index={index} onEdit={(p) => { setEditingPack(p); setShowModal(true); }} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
