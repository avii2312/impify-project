import { useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { ENDPOINTS } from '@/api/api';
import { trackPageView } from '@/utils/analytics';

// Helper function for date formatting
const formatDateString = (dateStr) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Unknown date';
  }
};

export const useDashboardData = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notes, setNotes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [quota, setQuota] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [error, setError] = useState(null);
  const [previousLevel, setPreviousLevel] = useState(null);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

  const fetchNotes = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.notes)
      .then(response => {
        setNotes(response.data.notes || []);
        setError(null);
      })
      .catch(error => {
        console.error('Failed to load notes:', error);
        setNotes([]);
        setError('Failed to load notes');
        toast.error('Failed to load notes');
      });
  }, []);

  const fetchStats = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.dashboardStats)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Failed to load stats:', error);
      });
  }, []);

  const fetchQuota = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.quotaStatus)
      .then(response => {
        setQuota(response.data);
      })
      .catch(error => {
        console.error('Failed to load quota:', error);
      });
  }, []);

  const fetchTokenInfo = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.tokenInfo)
      .then(response => {
        const newTokenInfo = response.data;
        const currentLevel = newTokenInfo.level || 1;

        // Check if level increased
        if (previousLevel !== null && currentLevel > previousLevel) {
          setShowLevelUpAnimation(true);
          // Reset animation after 3 seconds
          setTimeout(() => setShowLevelUpAnimation(false), 3000);
        }

        setPreviousLevel(currentLevel);
        setTokenInfo(newTokenInfo);
      })
      .catch(error => {
        console.error('Failed to load token info:', error);
      });
  }, [previousLevel]);

  const fetchNotifications = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.notifications)
      .then(response => {
        const notificationsData = response.data?.notifications || [];
        setNotifications(notificationsData);
      })
      .catch(error => {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
      });
  }, []);

  const fetchFlashcards = useCallback(() => {
    return axiosInstance.get(ENDPOINTS.flashcards)
      .then(response => {
        setFlashcards(response.data?.flashcards || []);
      })
      .catch(error => {
        console.error('Failed to load flashcards:', error);
        setFlashcards([]);
      });
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    setError(null);

    return Promise.all([
      fetchNotes(),
      fetchStats(),
      fetchQuota(),
      fetchNotifications(),
      fetchFlashcards(),
      fetchTokenInfo()
    ])
    .finally(() => {
      setLoading(false);
    });
  }, [fetchNotes, fetchStats, fetchQuota, fetchNotifications, fetchFlashcards, fetchTokenInfo]);

  useEffect(() => {
    trackPageView('Dashboard');
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);

    if (unread > 0) {
      toast.info(`You have ${unread} new notification${unread > 1 ? 's' : ''}!`, {
        duration: 4000,
        action: {
          label: 'View',
          onClick: () => window.location.href = '/notifications'
        }
      });
    }
  }, [notifications]);

  const dashboardStats = useMemo(() => ({
    notes: stats?.notes || notes.length || 0,
    flashcards: stats?.flashcards || flashcards.length || 0,
    uploads: stats?.uploads || 0,
    accuracy: stats?.accuracy || 0
  }), [stats, notes.length, flashcards.length]);

  const recentNotes = useMemo(() => notes.slice(0, 3), [notes]);

  const recentFlashcards = useMemo(() => flashcards.slice(0, 3), [flashcards]);

  const recentActivity = useMemo(() => {
    if (!notes || notes.length === 0) return [];

    return notes.slice(0, 4).map(note => ({
      title: note.title,
      description: note.note_type === 'question_paper' ? 'Question paper analyzed' : 'Notes uploaded',
      timestamp: formatDateString(note.created_at),
      type: note.note_type === 'question_paper' ? 'upload' : 'note'
    }));
  }, [notes]);

  return useMemo(() => ({
    notifications,
    notes,
    flashcards,
    stats,
    quota,
    tokenInfo,
    loading,
    error,
    unreadCount,
    dashboardStats,
    recentNotes,
    recentFlashcards,
    recentActivity,
    showLevelUpAnimation,
    refreshData,
    fetchNotes,
    fetchFlashcards,
    fetchTokenInfo,
    setNotes,
    setFlashcards,
    setStats,
    setQuota,
    setTokenInfo
  }), [
    notifications,
    notes,
    flashcards,
    stats,
    quota,
    tokenInfo,
    loading,
    error,
    unreadCount,
    dashboardStats,
    recentNotes,
    recentFlashcards,
    recentActivity,
    showLevelUpAnimation,
    refreshData,
    fetchNotes,
    fetchFlashcards,
    fetchTokenInfo
  ]);
};