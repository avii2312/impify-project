import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  Grid3X3
} from 'lucide-react';

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-400'
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      path: '/admin/payments',
      label: 'Payments',
      icon: BarChart3,
      color: 'text-green-400'
    },
    {
      path: '/admin/tokens',
      label: 'Tokens',
      icon: Grid3X3,
      color: 'text-yellow-400'
    },
    {
      path: '/admin/notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'text-gray-400'
    },
    {
      path: '/admin/community',
      label: 'Community',
      icon: MessageSquare,
      color: 'text-purple-400'
    },
    {
      path: '/admin/support',
      label: 'Support',
      icon: FileText,
      color: 'text-gray-400'
    },
    {
      path: '/admin/analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-blue-400'
    },
    {
      path: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-purple-400'
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-lg"
      >
        {isOpen ? <X size={20} className="text-foreground" /> : <Menu size={20} className="text-foreground" />}
      </Button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-card/80 backdrop-blur-xl border-r border-border p-6 flex flex-col transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="text-center mb-8 pt-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl border border-border flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Admin Panel
          </h2>
          <p className="text-muted-foreground text-sm">
            v2.0.0
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <div className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full justify-start py-4 px-4 rounded-2xl font-medium transition-all duration-300 ${
                    active
                      ? 'bg-primary/20 border border-primary/30 text-foreground shadow-lg backdrop-blur-sm'
                      : 'border border-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.label.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="pt-6 mt-auto">
          <Button
            onClick={() => {
              onLogout();
              if (isMobile) {
                setIsOpen(false);
              }
            }}
            className="w-full justify-start py-4 px-4 bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive/40 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm"
          >
            <LogOut size={18} className="mr-3" />
            LOGOUT ADMIN
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}