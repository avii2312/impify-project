import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Clock,
  Settings,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Star
} from 'lucide-react';
import axiosInstance from '@/api/axios';
import { ENDPOINTS } from '@/api/api';


const Notifications = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.notifications);
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error('Failed to load notifications');
      // Fallback to empty array on error
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const markNotificationRead = async (notificationId) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );

      // Call backend API
      await axiosInstance.patch(ENDPOINTS.notificationRead(notificationId));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark as read');
      // Revert on error
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: false } : n)
      );
    }
  };

  const markAllNotificationsRead = async () => {
    setMarkingRead(true);
    try {
      // Update local state immediately for better UX
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

      // Call backend API
      await axiosInstance.patch(ENDPOINTS.notificationsMarkAllRead);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all as read');
      // Revert on error - fetch fresh data
      await fetchNotifications();
    } finally {
      setMarkingRead(false);
    }
  };

  const formatNotificationTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) return 'bg-muted/5 border-border';
    
    switch (type) {
      case 'success':
        return 'bg-green-500/5 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/5 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/5 border-red-500/20';
      default:
        return 'bg-primary/5 border-primary/20';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.is_read).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      x: 4,
      scale: 1.01,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 overflow-auto">
        <motion.div
          ref={ref}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            variants={headerVariants}
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
                  >
                    <Bell className="w-6 h-6 text-primary" />
                  </motion.div>
                  
                  <div>
                    <motion.h1 
                      className="text-4xl font-bold text-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Notifications
                    </motion.h1>
                    <motion.p 
                      className="text-lg text-muted-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
                    </motion.p>
                  </div>
                </div>
                
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={markAllNotificationsRead}
                      disabled={markingRead}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 py-3 rounded-lg font-medium shadow-soft"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {markingRead ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      Mark All Read
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <Card className="bg-card border border-border rounded-xl p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
                />
              </div>
            </Card>
          </motion.div>

          {/* Notifications Content */}
          {loading ? (
            <motion.div 
              className="flex justify-center items-center py-16 bg-card border border-border rounded-2xl shadow-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-muted-foreground text-lg">Loading notifications...</p>
              </div>
            </motion.div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-2xl shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6"
              >
                <Bell size={40} className="text-yellow-500 opacity-60" />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-semibold text-foreground mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {searchQuery ? 'No notifications found' : 'All caught up!'}
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground text-center mb-6 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : "You're all caught up! We'll notify you when there's something important."
                }
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        getNotificationBgColor(notification.type, notification.is_read)
                      }`}
                      onClick={() => !notification.is_read && markNotificationRead(notification.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <motion.div 
                            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              notification.is_read 
                                ? 'bg-muted/10' 
                                : notification.type === 'success' ? 'bg-green-500/10' :
                                  notification.type === 'warning' ? 'bg-yellow-500/10' :
                                  notification.type === 'error' ? 'bg-red-500/10' : 'bg-primary/10'
                            }`}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                          >
                            {getNotificationIcon(notification.type)}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-foreground pr-2">
                                {notification.title}
                              </h3>
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {!notification.is_read && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-primary rounded-full"
                                    whileHover={{ scale: 1.2 }}
                                  />
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-8 h-8 p-0 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle more options
                                  }}
                                >
                                  <MoreVertical size={14} />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-muted">
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatNotificationTime(notification.created_at)}
                                </span>
                                
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    notification.type === 'success' ? 'text-green-600 border-green-200' :
                                    notification.type === 'warning' ? 'text-yellow-600 border-yellow-200' :
                                    notification.type === 'error' ? 'text-red-600 border-red-200' :
                                    'text-blue-600 border-blue-200'
                                  }`}
                                >
                                  {notification.type}
                                </Badge>
                              </div>
                              
                              {!notification.is_read && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markNotificationRead(notification.id);
                                    }}
                                    size="sm"
                                    className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 px-3 py-1 text-xs"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Eye size={12} className="mr-1" />
                                    Mark Read
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Quick Actions */}
          {filteredNotifications.length > 0 && (
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="button-dark gap-2"
                    onClick={() => navigate('/settings')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings size={14} />
                    Notification Settings
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="button-dark gap-2"
                    onClick={() => {
                      setNotifications([]);
                      toast.success('All notifications cleared');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} />
                    Clear All
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;