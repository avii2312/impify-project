import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoaderScreen from "@/components/ui/LoaderScreen";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/layouts/AppLayout";
import AuthLanding from "@/pages/AuthLanding";
import AuthForm from "@/pages/AuthForm";
import ResetPassword from "@/pages/ResetPassword";
import ConsentPage from "@/pages/ConsentPage";
import Dashboard from "@/pages/Dashboard";
import Notes from "@/pages/Notes";
import NoteView from "@/pages/NoteView";
import Flashcards from "@/pages/Flashcards";
import PaperAnalysis from "@/pages/PaperAnalysis";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Community from "@/pages/Community";
import Support from "@/pages/Support";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminPayments from "@/pages/AdminPayments";
import AdminTokens from "@/pages/AdminTokens";
import AdminCommunity from "@/pages/AdminCommunity";
import AdminSupport from "@/pages/AdminSupport";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminSettings from "@/pages/AdminSettings";
import AdminNotifications from "@/pages/AdminNotifications";
const ChatPage = React.lazy(() => import("@/pages/Chat"));
const PlansPage = React.lazy(() => import("@/pages/PlansPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoaderScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthLanding />} />
        <Route path="/auth-form" element={<AuthForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Consent Route - requires auth but not consent */}
        <Route path="/consent" element={
          <ProtectedRoute requireConsent={false}>
            <ConsentPage />
          </ProtectedRoute>
        } />

        {/* Protected User Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/notes" element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } />
          <Route path="/note/:id" element={
            <ProtectedRoute>
              <NoteView />
            </ProtectedRoute>
          } />
          <Route path="/flashcards" element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute>
              <PaperAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <PlansPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute adminOnly>
            <AdminPayments />
          </ProtectedRoute>
        } />
        <Route path="/admin/tokens" element={
          <ProtectedRoute adminOnly>
            <AdminTokens />
          </ProtectedRoute>
        } />
        <Route path="/admin/community" element={
          <ProtectedRoute adminOnly>
            <AdminCommunity />
          </ProtectedRoute>
        } />
        <Route path="/admin/support" element={
          <ProtectedRoute adminOnly>
            <AdminSupport />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute adminOnly>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute adminOnly>
            <AdminSettings />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute adminOnly>
            <AdminNotifications />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center text-foreground bg-slate-900">
            404 - Not Found
          </div>
        } />
      </Routes>
    </Suspense>
  );
}