import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, Search, UserPlus, Download, Mail, Shield, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, Coins, Calendar, Activity, Ban, CheckCircle } from 'lucide-react';
import { adminAPI } from '@/services/adminAPI';
import { Button } from '@/components/ui/button';

const UserAvatar = ({ user, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = (user.name || user.email || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['from-indigo-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-pink-500 to-rose-500', 'from-blue-500 to-cyan-500'];
  const colorIndex = (user.email || '').charCodeAt(0) % colors.length;
  return <div className={`${sizes[size]} rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-medium text-white`}>{initials}</div>;
};

const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    inactive: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
    suspended: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' }
  };
  const { bg, text, dot } = config[status] || config.inactive;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}><span className={`w-1.5 h-1.5 rounded-full ${dot}`} />{status?.charAt(0).toUpperCase() + status?.slice(1)}</span>;
};

const RoleBadge = ({ role }) => {
  const config = { admin: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: Shield }, user: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Users } };
  const { bg, text, icon: Icon } = config[role] || config.user;
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}><Icon size={12} />{role?.charAt(0).toUpperCase() + role?.slice(1)}</span>;
};

const UserDetailsModal = ({ user, onClose, onUpdate }) => {
  const [tokens, setTokens] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddTokens = async () => {
    if (tokens <= 0) return;
    setLoading(true);
    try {
      await adminAPI.addUserTokens(user.id, tokens);
      toast.success(`Added ${tokens} tokens to ${user.name || user.email}`);
      onUpdate();
      setTokens(0);
    } catch (error) { toast.error('Failed to add tokens'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (status) => {
    try {
      await adminAPI.updateUserStatus(user.id, status);
      toast.success(`User ${status}`);
      onUpdate();
    } catch (error) { toast.error('Failed to update status'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-white">{user.name || 'No name'}</h3>
                <p className="text-sm text-white/50">{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><X size={20} className="text-white/50" /></button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5"><Coins size={18} className="text-amber-400 mb-2" /><p className="text-xl font-bold text-white">{user.tokens || 0}</p><p className="text-xs text-white/40">Tokens</p></div>
            <div className="p-4 rounded-xl bg-white/5"><Activity size={18} className="text-emerald-400 mb-2" /><p className="text-xl font-bold text-white">{user.streak || 0}</p><p className="text-xs text-white/40">Streak</p></div>
            <div className="p-4 rounded-xl bg-white/5"><Calendar size={18} className="text-blue-400 mb-2" /><p className="text-xl font-bold text-white">{user.level || 1}</p><p className="text-xs text-white/40">Level</p></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Add Tokens</label>
            <div className="flex gap-3">
              <input type="number" value={tokens} onChange={(e) => setTokens(parseInt(e.target.value) || 0)} placeholder="Amount" className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50" />
              <Button onClick={handleAddTokens} disabled={loading || tokens <= 0} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">Add</Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1"><label className="block text-sm font-medium text-white/70 mb-2">Status</label><StatusBadge status={user.status || 'active'} /></div>
            <div className="flex-1"><label className="block text-sm font-medium text-white/70 mb-2">Role</label><RoleBadge role={user.role || 'user'} /></div>
          </div>
          <div className="flex gap-2">
            {user.status !== 'suspended' && <Button onClick={() => handleStatusChange('suspended')} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"><Ban size={16} className="mr-2" />Suspend</Button>}
            {user.status === 'suspended' && <Button onClick={() => handleStatusChange('active')} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"><CheckCircle size={16} className="mr-2" />Activate</Button>}
          </div>
          <div className="text-sm text-white/40">
            <p>Joined: {new Date(user.created_at || user.createdAt).toLocaleDateString()}</p>
            <p>Last active: {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>
        <div className="p-6 border-t border-white/10 flex gap-3">
          <Button onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0">Close</Button>
          <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"><Mail size={16} className="mr-2" />Send Email</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AdminUsers({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  const handleLogout = () => { localStorage.removeItem('admin_token'); onLogout(); };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data?.users || []);
    } catch (error) { console.error('Error fetching users:', error); toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, filterStatus, filterRole]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  return (
    <>
      <AnimatePresence>{selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} onUpdate={fetchUsers} />}</AnimatePresence>
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="fixed inset-0 -z-10"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" /></div>
        <AdminSidebar onLogout={handleLogout} />
        <div className="lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500"><Users size={28} className="text-white" /></div>
                <div><h1 className="text-3xl lg:text-4xl font-bold text-white">Users</h1><p className="text-white/50 mt-1">{users.length} total users</p></div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => toast.info('Export feature coming soon')} className="bg-white/10 hover:bg-white/20 text-white border-0"><Download size={18} className="mr-2" />Export</Button>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"><UserPlus size={18} className="mr-2" />Add User</Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors" />
                </div>
                <div className="flex gap-3">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-blue-500/50">
                    <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
                  </select>
                  <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-blue-500/50">
                    <option value="all">All Roles</option><option value="user">User</option><option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full" /></div>
              ) : paginatedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20"><Users size={48} className="text-white/20 mb-4" /><p className="text-white/40">No users found</p></div>
              ) : (
                <>
                  <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-sm font-medium text-white/50">
                    <div className="col-span-4">User</div><div className="col-span-2">Status</div><div className="col-span-2">Role</div><div className="col-span-2">Tokens</div><div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y divide-white/[0.05]">
                    {paginatedUsers.map((user, index) => (
                      <motion.div key={user.id || user._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                        <div className="lg:col-span-4 flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div className="min-w-0"><p className="font-medium text-white truncate">{user.name || 'No name'}</p><p className="text-sm text-white/40 truncate">{user.email}</p></div>
                        </div>
                        <div className="lg:col-span-2 flex items-center"><StatusBadge status={user.status || 'active'} /></div>
                        <div className="lg:col-span-2 flex items-center"><RoleBadge role={user.role || 'user'} /></div>
                        <div className="lg:col-span-2 flex items-center"><span className="text-white">{user.tokens || 0}</span></div>
                        <div className="lg:col-span-2 flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Eye size={16} className="text-white/50" /></button>
                          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors"><Edit size={16} className="text-white/50" /></button>
                          <button className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={16} className="text-red-400" /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {totalPages > 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center justify-between mt-6">
                <p className="text-sm text-white/40">Showing {(currentPage - 1) * usersPerPage + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"><ChevronLeft size={18} className="text-white" /></button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>{page}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/5 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"><ChevronRight size={18} className="text-white" /></button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
