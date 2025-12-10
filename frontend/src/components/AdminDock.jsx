import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Bell,
  Coins,
  CreditCard,
  HelpCircle
} from 'lucide-react';

const AdminDockIcon = ({ label, icon: Icon, to = "/", onClick }) => {
  const loc = useLocation();
  const active = loc.pathname === to;

  const iconContent = onClick ? (
    <button onClick={onClick} className="flex flex-col items-center text-white/80">
      <motion.div
        whileHover={{ y: -6, scale: 1.16 }}
        whileTap={{ scale: 0.95 }}
        className={`p-3 rounded-2xl ${active ? "bg-white/12" : "bg-white/6"} backdrop-blur border border-white/8`}
      >
        <Icon size={20} />
      </motion.div>
      <div className="text-xs mt-1">{label}</div>
    </button>
  ) : (
    <Link to={to} className="flex flex-col items-center text-white/80">
      <motion.div
        whileHover={{ y: -6, scale: 1.16 }}
        className={`p-3 rounded-2xl ${active ? "bg-white/12" : "bg-white/6"} backdrop-blur border border-white/8`}
      >
        <Icon size={20} />
      </motion.div>
      <div className="text-xs mt-1">{label}</div>
    </Link>
  );

  return iconContent;
};

export const AdminDock = ({ onLogout }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <AdminDockIcon label="Dashboard" icon={LayoutDashboard} to="/admin/dashboard" />
        <AdminDockIcon label="Analytics" icon={BarChart3} to="/admin/analytics" />
        <AdminDockIcon label="Users" icon={Users} to="/admin/users" />
        <AdminDockIcon label="Payments" icon={CreditCard} to="/admin/payments" />
        <AdminDockIcon label="Tokens" icon={Coins} to="/admin/tokens" />
        <AdminDockIcon label="Notifications" icon={Bell} to="/admin/notifications" />
        <AdminDockIcon label="Community" icon={MessageSquare} to="/admin/community" />
        <AdminDockIcon label="Support" icon={HelpCircle} to="/admin/support" />
        <AdminDockIcon label="Settings" icon={Settings} to="/admin/settings" />
        <AdminDockIcon label="Logout" icon={LogOut} onClick={onLogout} />
      </motion.div>
    </div>
  );
};