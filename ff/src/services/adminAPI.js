// src/services/adminAPI.js
import axiosInstance from '@/api/axios';
import { ENDPOINTS } from '@/api/api';

export const adminAPI = {
  // Dashboard
  getDashboardStats: () => axiosInstance.get(ENDPOINTS.adminDashboardStats),
  getDashboardActivity: () => axiosInstance.get(ENDPOINTS.adminDashboardActivity),

  // Users
  getUsers: () => axiosInstance.get(ENDPOINTS.adminUsers),
  getAdminStats: () => axiosInstance.get(ENDPOINTS.adminStats),
  updateUserStatus: (userId, status) =>
    axiosInstance.patch(ENDPOINTS.adminUsersStatus(userId), { status }),
  deleteUser: (userId) => axiosInstance.delete(ENDPOINTS.adminUsersDelete(userId)),
  exportUsers: () => axiosInstance.get(ENDPOINTS.adminUsersExport, { responseType: 'blob' }),

  // Community
  getCommunityPosts: () => axiosInstance.get(ENDPOINTS.adminCommunityPosts),
  getCommunityStats: () => axiosInstance.get(ENDPOINTS.adminCommunityStats),
  deleteCommunityPost: (postId) => axiosInstance.delete(ENDPOINTS.adminCommunityPostDelete(postId)),
  flagCommunityPost: (postId) => axiosInstance.patch(ENDPOINTS.adminCommunityPostFlag(postId)),

  // Support
  getSupportTickets: () => axiosInstance.get(ENDPOINTS.adminSupportTickets),
  getSupportStats: () => axiosInstance.get(ENDPOINTS.adminSupportStats),
  updateTicketStatus: (ticketId, status) =>
    axiosInstance.patch(ENDPOINTS.adminSupportTicketStatus(ticketId), { status }),
  deleteTicket: (ticketId) => axiosInstance.delete(ENDPOINTS.adminSupportTicketDelete(ticketId)),

  // Analytics
  getAnalytics: (range = '30d') => axiosInstance.get(`${ENDPOINTS.adminAnalytics}?range=${range}`),
  exportAnalytics: () => axiosInstance.get(ENDPOINTS.adminAnalyticsExport, { responseType: 'blob' }),

  // Settings
  getSettings: () => axiosInstance.get(ENDPOINTS.adminSettings),
  updateSettings: (settings) => axiosInstance.put(ENDPOINTS.adminSettings, settings),
  testEmail: () => axiosInstance.post(ENDPOINTS.adminSettingsTestEmail),
  resetSettings: () => axiosInstance.post(ENDPOINTS.adminSettingsReset),

  // Notifications
  createNotification: (data) => axiosInstance.post(ENDPOINTS.adminNotifications, data),
  getAdminNotifications: () => axiosInstance.get(ENDPOINTS.adminNotifications),
  getNotifications: () => axiosInstance.get(ENDPOINTS.adminNotifications),
  getNotificationStats: () => axiosInstance.get(`${ENDPOINTS.adminNotifications}/stats`),
  deleteNotification: (id) => axiosInstance.delete(`${ENDPOINTS.adminNotifications}/${id}`),

  // Community moderation
  moderatePost: (postId, action) => {
    if (action === 'approve') {
      return axiosInstance.patch(ENDPOINTS.adminCommunityPostFlag(postId), { action: 'unflag' });
    } else if (action === 'remove') {
      return axiosInstance.delete(ENDPOINTS.adminCommunityPostDelete(postId));
    }
  },

  // Support replies
  addTicketReply: (ticketId, replyText) =>
    axiosInstance.post(`${ENDPOINTS.adminSupportTickets}/${ticketId}/reply`, { message: replyText }),
};

export default adminAPI;