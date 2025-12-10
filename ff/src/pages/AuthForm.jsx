import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import useReducedMotionOrLowPower from "@/utils/useReducedMotionOrLowPower";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles,
  ArrowRight,
  Brain,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Zap,
  Shield,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  FileText,
  BarChart3,
  Clock,
  Award,
  Quote,
  Play,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Target,
  Rocket,
  Heart,
  Activity,
  Layers,
  Cpu,
  Database,
  Code,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const AuthForm = () => {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", username: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Performance optimization hook
  const reduce = useReducedMotionOrLowPower();

  const { login, register, forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || "login");

  // Enhanced mouse tracking with spring physics
  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        setMousePosition({ x, y });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Visibility detection for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Cleanup will-change properties after initial animations
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[style*="will-change"]');
      elements.forEach(el => {
        if (el.style.willChange && !el.classList.contains('motion-safe')) {
          el.style.willChange = 'auto';
        }
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tab === "login") {
      const result = await login(form.email, form.password, rememberMe);
      if (result.success) {
        navigate("/dashboard");
      } else {
        // Error is handled in AuthContext
      }
    } else {
      if (form.password !== form.confirm) {
        toast.error("Passwords don't match");
        return;
      }

      const result = await register(form.email, form.password, form.username);
      if (result.success) {
        setTab("login");
        toast.success("Registered — check your email");
      } else {
        // Error is handled in AuthContext
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResettingPassword(true);

    try {
      const result = await forgotPassword(forgotPasswordEmail);
      if (result.success) {
        toast.success('Password reset email sent! Please check your inbox.');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden dark bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Optimized Animated Background */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        {/* Primary gradient orbs - reduced blur and size for performance */}
        {!reduce && (
          <motion.div
            className="absolute w-[400px] h-[400px] bg-gradient-to-r from-purple-600/25 via-indigo-600/15 to-blue-600/25 blur-[32px] rounded-full -top-24 -left-16 pointer-events-none"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}

        {!reduce && (
          <motion.div
            className="absolute w-[350px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-teal-500/15 to-emerald-500/20 blur-[28px] rounded-full bottom-16 right-8 pointer-events-none"
            animate={{
              scale: [1.05, 1, 1.05],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              delay: 4
            }}
          />
        )}

        {/* Interactive mouse-following orb - only on high-performance devices */}
        {!reduce && (
          <motion.div
            className="absolute w-[250px] h-[250px] bg-gradient-to-r from-pink-500/15 via-rose-500/10 to-purple-500/15 blur-[24px] rounded-full top-1/3 left-1/3 pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 30,
              mass: 1
            }}
          />
        )}

        {/* Additional ambient orbs - staggered and reduced */}
        {!reduce && (
          <motion.div
            className="absolute w-[200px] h-[200px] bg-violet-500/12 blur-[20px] rounded-full top-1/4 right-1/4 pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.08, 0.25, 0.08]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
              delay: 8
            }}
          />
        )}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)] opacity-30" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Enhanced Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 will-change-transform-opacity"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="w-11 h-11 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10"
                style={{ willChange: 'transform' }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <img src="/logo.png" alt="Impify" className="w-6 h-6" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Impify
                </span>
                <div className="text-xs text-slate-400 -mt-1">AI Study Platform</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Auth Form Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="max-w-lg mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative rounded-3xl p-10 border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="mb-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30"
                >
                  <img src="/logo.png" alt="Impify" className="w-8 h-8" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-3"
                >
                  {tab === "login" ? "Welcome back" : "Join the revolution"}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-300 text-lg"
                >
                  {tab === "login"
                    ? "Continue your AI-powered learning journey"
                    : "Join thousands of students transforming their education"}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 flex rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 p-1.5 border border-slate-600/30 backdrop-blur-xl"
              >
                <motion.button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    tab === "login"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    tab === "register"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Sign Up
                </motion.button>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {tab === "register" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="username" className="block text-sm font-bold text-slate-200 mb-3">
                      Username
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300 backdrop-blur-xl"
                        placeholder="Choose a username"
                        autoComplete="username"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: tab === "register" ? 0.8 : 0.7 }}
                >
                  <label htmlFor="email" className="block text-sm font-bold text-slate-200 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300 backdrop-blur-xl"
                      placeholder="you@university.edu"
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="password" className="block text-sm font-bold text-slate-200 mb-3">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300 backdrop-blur-xl"
                      placeholder="Enter your password"
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>

                {tab === "register" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-200 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        type="password"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300 backdrop-blur-xl"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-3 text-slate-300 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-400 focus:ring-offset-0"
                    />
                    <span className="group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Forgot password?
                  </motion.button>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : tab === "login" ? (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Create Account
                        <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>

                {tab === "register" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center text-slate-400 text-sm mt-6 leading-relaxed"
                  >
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      Privacy Policy
                    </a>
                  </motion.p>
                )}
              </motion.form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md p-6 rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
            <p className="text-slate-300 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-bold text-slate-200 mb-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@university.edu"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-600 text-white placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300 backdrop-blur-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-slate-800/60 border border-slate-600 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500/50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResettingPassword ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </div>
                  )}
                </button>
              </div>
            </form>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;