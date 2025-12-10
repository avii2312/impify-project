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
  createUser: (userData) => axiosInstance.post(ENDPOINTS.adminUsers, userData),
  updateUser: (userId, userData) => axiosInstance.put(`${ENDPOINTS.adminUsers}/${userId}`, userData),
  updateUserStatus: (userId, status) =>
    axiosInstance.patch(ENDPOINTS.adminUsersStatus(userId), { status }),
  deleteUser: (userId) => axiosInstance.delete(ENDPOINTS.adminUsersDelete(userId)),
  exportUsers: () => axiosInstance.get(ENDPOINTS.adminUsersExport, { responseType: 'blob' }),
  addUserTokens: (userId, amount) =>
    axiosInstance.post(`/api/admin/users/${userId}/tokens`, { amount }),

  // Payments
  getPayments: () => axiosInstance.get(ENDPOINTS.adminPayments),
  exportPayments: () => axiosInstance.get(ENDPOINTS.adminPaymentsExport, { responseType: 'blob' }),

  // Token Packs
  getTokenPacks: () => axiosInstance.get(ENDPOINTS.adminTokenPacks),
  createTokenPack: (packData) => axiosInstance.post(ENDPOINTS.adminTokenPacks, packData),
  updateTokenPack: (packId, packData) => axiosInstance.put(`${ENDPOINTS.adminTokenPacks}/${packId}`, packData),
  deleteTokenPack: (packId) => axiosInstance.delete(`${ENDPOINTS.adminTokenPacks}/${packId}`),
  exportTokenPacks: () => axiosInstance.get(ENDPOINTS.adminTokenPacksExport, { responseType: 'blob' }),

  // Community
  getCommunityPosts: () => axiosInstance.get(ENDPOINTS.adminCommunityPosts),
  getCommunityStats: () => axiosInstance.get(ENDPOINTS.adminCommunityStats),
  exportCommunityData: () => axiosInstance.get(ENDPOINTS.adminCommunityExport, { responseType: 'blob' }),
  deleteCommunityPost: (postId) => axiosInstance.delete(ENDPOINTS.adminCommunityPostDelete(postId)),
  flagCommunityPost: (postId) => axiosInstance.patch(ENDPOINTS.adminCommunityPostFlag(postId)),
  moderatePost: (postId, action) => {
    if (action === 'approve') {
      return axiosInstance.patch(ENDPOINTS.adminCommunityPostFlag(postId), { action: 'unflag' });
    } else if (action === 'remove') {
      return axiosInstance.delete(ENDPOINTS.adminCommunityPostDelete(postId));
    }
  },

  // Support
  getSupportTickets: () => axiosInstance.get(ENDPOINTS.adminSupportTickets),
  getSupportStats: () => axiosInstance.get(ENDPOINTS.adminSupportStats),
  exportSupportData: () => axiosInstance.get(ENDPOINTS.adminSupportExport, { responseType: 'blob' }),
  updateTicketStatus: (ticketId, status) =>
    axiosInstance.patch(ENDPOINTS.adminSupportTicketStatus(ticketId), { status }),
  deleteTicket: (ticketId) => axiosInstance.delete(ENDPOINTS.adminSupportTicketDelete(ticketId)),
  addTicketReply: (ticketId, replyText) =>
    axiosInstance.post(`${ENDPOINTS.adminSupportTickets}/${ticketId}/reply`, { message: replyText }),

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
  updateNotification: (id, data) => axiosInstance.put(`${ENDPOINTS.adminNotifications}/${id}`, data),
  deleteNotification: (id) => axiosInstance.delete(`${ENDPOINTS.adminNotifications}/${id}`),
  exportNotifications: () => axiosInstance.get(ENDPOINTS.adminNotificationsExport, { responseType: 'blob' }),
};

export default adminAPI;