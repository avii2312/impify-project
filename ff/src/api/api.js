const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://impify.visasystem.in";

export const ENDPOINTS = {
  // Auth endpoints
  login: `/auth/login`,
  register: `/auth/register`,
  verify: `/auth/verify`,
  refresh: `/auth/refresh`,
  forgotPassword: `/auth/forgot-password`,
  resetPassword: `/auth/reset-password`,
  postLoginInit: `/auth/post-login-init`,  // NEW: Post-login initialization
  adminLogin: `/admin/auth/login`,

  // User endpoints
  notes: `/notes`,
  notesById: (id) => `/notes/${id}`,
  notesExport: (id) => `/notes/${id}/export`,
  dashboardStats: `/dashboard/stats`,
  quotaStatus: `/quota/status`,
  notesUpload: `/notes/upload`,

  // User profile endpoints
  userProfile: `/user/profile`,
  userPassword: `/user/password`,

  // Folder endpoints
  folders: `/folders`,
  folderById: (id) => `/folders/${id}`,
  folderNotes: (id) => `/folders/${id}/notes`,
  folderMoveNote: (folderId, noteId) => `/folders/${folderId}/notes/${noteId}`,
  folderBulkAddNotes: (folderId) => `/folders/${folderId}/notes/bulk`,
  
  // Flashcard endpoints
  flashcardsGenerate: `/flashcards/generate`,
  flashcards: `/flashcards`,
  flashcardsDue: `/flashcards/due`,
  flashcardsReview: (id) => `/flashcards/${id}/review`,
  flashcardsDelete: (id) => `/flashcards/${id}`,

  // Community endpoints
  communityPosts: `/community/posts`,
  communityStats: `/community/stats`,
  communityPostLike: (id) => `/community/posts/${id}/like`,

  // Support endpoints
  supportTickets: `/support/tickets`,
  supportStats: `/support/stats`,
  supportTicketStatus: (id) => `/support/tickets/${id}/status`,

  // Volunteer endpoints
  volunteerRegister: `/volunteers/register`,

  // Consent endpoints
  consentStatus: `/consent/status`,
  consentUpdate: `/consent/update`,

  // Subscription endpoints - NEW
  subscriptionPlans: `/subscriptions/plans`,
  subscriptionCurrent: `/subscriptions/current`,
  subscriptionSubscribe: `/subscriptions/subscribe`,
  subscriptionConfirm: `/subscriptions/confirm`,
  subscriptionCancel: `/subscriptions/cancel`,

  // Admin endpoints
  adminDashboardStats: `/admin/dashboard/stats`,
  adminDashboardActivity: `/admin/dashboard/recent-activity`,
  adminUsers: `/admin/users`,
  adminUsersStatus: (id) => `/admin/users/${id}/status`,
  adminUsersDelete: (id) => `/admin/users/${id}`,
  adminUsersExport: `/admin/users/export`,
  adminStats: `/admin/stats`,
  adminCommunityPosts: `/admin/community/posts`,
  adminCommunityStats: `/admin/community/stats`,
  adminCommunityPostDelete: (id) => `/admin/community/posts/${id}`,
  adminCommunityPostFlag: (id) => `/admin/community/posts/${id}/flag`,
  adminSupportTickets: `/admin/support/tickets`,
  adminSupportStats: `/admin/support/stats`,
  adminSupportTicketStatus: (id) => `/admin/support/tickets/${id}/status`,
  adminSupportTicketDelete: (id) => `/admin/support/tickets/${id}`,
  adminAnalytics: `/admin/analytics`,
  adminAnalyticsExport: `/admin/analytics/export`,
  adminSettings: `/admin/settings`,
  adminSettingsTestEmail: `/admin/settings/test-email`,
  adminSettingsReset: `/admin/settings/reset`,

  // Admin Notifications
  adminNotifications: `/admin/notifications`,

  // User Notifications
  notifications: `/notifications`,
  notificationsMarkAllRead: `/notifications/mark-all-read`,
  notificationRead: (id) => `/notifications/${id}/read`,

  // Chat endpoints
  chat: `/chat`,
  fileChat: `/chat/file_chat`,

  // Token endpoints
  tokenInfo: `/user/token-info`,
  tokenPurchaseInitiate: `/token/purchase/initiate`,
  tokenPurchaseSuccess: `/token/purchase/success`,
  tokenPurchaseFailure: `/token/purchase/failure`,
  userActivity: `/user/activity`,

  // Health check
  health: `/`,
};

export { BASE_URL };