import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Bell,
  Coins,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const menuItems = [
  {
    section: 'Overview',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
      { path: '/admin/analytics', label: 'Analytics', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
    ]
  },
  {
    section: 'Management',
    items: [
      { path: '/admin/users', label: 'Users', icon: Users, color: 'from-emerald-500 to-teal-500' },
      { path: '/admin/payments', label: 'Payments', icon: CreditCard, color: 'from-amber-500 to-orange-500' },
      { path: '/admin/tokens', label: 'Tokens', icon: Coins, color: 'from-yellow-500 to-amber-500' },
    ]
  },
  {
    section: 'Communication',
    items: [
      { path: '/admin/notifications', label: 'Notifications', icon: Bell, color: 'from-red-500 to-pink-500' },
      { path: '/admin/community', label: 'Community', icon: MessageSquare, color: 'from-violet-500 to-purple-500' },
      { path: '/admin/support', label: 'Support', icon: HelpCircle, color: 'from-cyan-500 to-blue-500' },
    ]
  },
  {
    section: 'System',
    items: [
      { path: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-slate-600' },
    ]
  }
];

const NavItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 relative group
        ${isActive
          ? 'text-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {/* Active background */}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-20`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b ${item.color}`}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}

      <div className={`relative p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.color}` : 'bg-white/5 group-hover:bg-white/10'} transition-colors`}>
        <Icon size={18} className="text-white" />
      </div>

      {!isCollapsed && (
        <span className="relative flex-1 text-left">{item.label}</span>
      )}

      {!isCollapsed && isActive && (
        <ChevronRight size={16} className="text-white/50" />
      )}
    </motion.button>
  );
};

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  return (
    <>
      {/* Mobile Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={20} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <Menu size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: -300 } : false}
        animate={isMobile ? { x: isOpen ? 0 : -300 } : { width: isCollapsed ? 80 : 288 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className={`
          fixed top-0 left-0 h-full z-40
          ${isMobile ? 'w-72' : sidebarWidth}
          bg-[#0c0c12]/95 backdrop-blur-2xl
          border-r border-white/[0.06]
          flex flex-col
          ${!isMobile && !isOpen ? 'lg:flex' : ''}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield size={24} className="text-white" />
              </div>
            </motion.div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h1 className="text-lg font-bold text-white">Impify</h1>
                <p className="text-xs text-white/40">Admin Panel</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.section}>
              {!isCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                  {section.section}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    isActive={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade Card */}
        {!isCollapsed && (
          <div className="p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-4 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700" />
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z\' fill=\'rgba(255,255,255,0.07)\'%3E%3C/path%3E%3C/svg%3E")' }} />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-xs font-semibold text-white/80">Pro Features</span>
                </div>
                <p className="text-sm text-white/90 mb-3">
                  Unlock advanced analytics and insights
                </p>
                <button className="w-full py-2 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors backdrop-blur-sm">
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl
              bg-red-500/10 hover:bg-red-500/20
              border border-red-500/20 hover:border-red-500/30
              text-red-400 hover:text-red-300
              transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={14} className={`text-white/60 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>
        )}
      </motion.aside>
    </>
  );
}