import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import useReducedMotionOrLowPower from "@/utils/useReducedMotionOrLowPower";
import {
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
  Tablet,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "@/components/SubscriptionModal";

const AuthLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Performance optimization hook
  const reduce = useReducedMotionOrLowPower();

  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Enhanced scroll effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const { scrollYProgress: featuresProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });

  // Smooth transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Optimized mouse tracking with reduced sensitivity
  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        mouseX.set(x);
        mouseY.set(y);
        setMousePosition({ x, y });
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

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


  return (
    <div className="relative min-h-screen overflow-x-hidden dark bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Optimized Animated Background */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        {/* Primary gradient orbs - optimized for performance */}
        {!reduce && (
          <motion.div
            className="absolute w-[300px] h-[300px] bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-blue-600/20 blur-[16px] rounded-full -top-16 -left-12 pointer-events-none"
            style={{
              x: springX,
              y: springY,
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}

        {!reduce && (
          <motion.div
            className="absolute w-[250px] h-[250px] bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-emerald-500/15 blur-[14px] rounded-full bottom-12 right-6 pointer-events-none"
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            animate={{
              scale: [1.02, 1, 1.02],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
              delay: 6
            }}
          />
        )}

        {/* Interactive mouse-following orb - optimized */}
        {!reduce && (
          <motion.div
            className="absolute w-[180px] h-[180px] bg-gradient-to-r from-pink-500/10 via-rose-500/8 to-purple-500/10 blur-[12px] rounded-full top-1/3 left-1/3 pointer-events-none"
            style={{
              x: springX,
              y: springY,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 40,
              mass: 1
            }}
          />
        )}

        {/* Additional ambient orbs - reduced */}
        {!reduce && (
          <motion.div
            className="absolute w-[150px] h-[150px] bg-violet-500/8 blur-[10px] rounded-full top-1/4 right-1/4 pointer-events-none"
            style={{
              transform: 'translateZ(0)'
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
              delay: 10
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
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10"
                style={{ willChange: 'transform' }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(99, 102, 241, 0.1)",
                    "0 0 30px rgba(99, 102, 241, 0.2)",
                    "0 0 20px rgba(99, 102, 241, 0.1)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img src="/logo.png" alt="Impify Logo" className="w-8 h-8 sm:w-10 sm:h-10 border border-indigo-400/70 rounded-lg filter brightness-110" />
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

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          style={{
            y,
            opacity,
            scale,
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Floating elements - optimized */}
          <motion.div
            className="absolute -top-16 -left-16 w-24 h-24 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-lg"
            style={{ transform: 'translateZ(0)' }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-12 -right-12 w-20 h-20 bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-lg"
            style={{ transform: 'translateZ(0)' }}
            animate={{
              y: [0, 10, 0],
              opacity: [0.15, 0.35, 0.15]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 200
            }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/40 rounded-2xl text-sm font-medium text-slate-300 mb-8 shadow-lg shadow-slate-900/20">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 text-indigo-400" />
              </motion.div>
              <span>Next-Generation AI Study Platform</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 100
            }}
            style={{ willChange: 'transform, opacity' }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 leading-tight"
          >
            Transform Your{" "}
            <motion.span
              className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block sm:inline"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                backgroundSize: "200% 200%"
              }}
            >
              Learning Journey
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ willChange: 'transform, opacity' }}
            className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
          >
            Harness the power of advanced AI to process PDFs, generate intelligent flashcards,
            and track your academic progress. Study smarter, not harder.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ willChange: 'transform, opacity' }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.button
              onClick={() => navigate('/auth-form', { state: { tab: 'register' } })}
              className="group px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Free Trial
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/auth-form')}
              className="px-10 py-5 bg-slate-800/60 backdrop-blur-xl border-2 border-slate-600/40 text-white font-bold text-lg rounded-2xl hover:bg-slate-700/60 hover:border-slate-500/50 transition-all duration-300"
              whileHover={{
                scale: 1.05,
                y: -2,
                backgroundColor: "rgba(51, 65, 85, 0.7)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Sign In
            </motion.button>
          </motion.div>

          {/*
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ willChange: 'transform, opacity' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { icon: Shield, text: "No credit card required", color: "text-green-400" },
              { icon: Clock, text: "14-day free trial", color: "text-blue-400" },
              { icon: Heart, text: "Cancel anytime", color: "text-pink-400" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                className="flex items-center justify-center gap-3 p-4 bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(51, 65, 85, 0.4)" }}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-slate-300 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
          */}

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-slate-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* Enhanced Features Section */}
      <section ref={featuresRef} id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements - optimized */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950/50" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-2xl"
          style={{
            y: featuresProgress,
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-pink-500/8 to-rose-500/8 rounded-full blur-2xl"
          style={{
            y: featuresProgress,
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-slate-700/50 rounded-2xl mb-6"
            >
              <img src="/logo.png" alt="Impify" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-indigo-400/50 bg-white/10 p-1" />
            </motion.div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Modern Learning
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Everything you need to excel in your studies, powered by cutting-edge AI technology
              and designed for the future of education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Cpu,
                title: "AI PDF Processing",
                description: "Upload any PDF and let advanced AI extract key concepts, definitions, and important information automatically with unprecedented accuracy.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0
              },
              {
                icon: Brain,
                title: "Smart Flashcards",
                description: "Generate intelligent flashcards with advanced spaced repetition algorithms and adaptive learning for optimal memorization.",
                gradient: "from-purple-500 to-pink-500",
                delay: 0.1
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description: "Track your learning progress with detailed analytics, insights, and AI-powered recommendations to improve your study habits.",
                gradient: "from-emerald-500 to-teal-500",
                delay: 0.2
              },
              {
                icon: Clock,
                title: "Time Management",
                description: "Optimize your study schedule with AI-powered recommendations based on your learning patterns and performance data.",
                gradient: "from-orange-500 to-red-500",
                delay: 0.3
              },
              {
                icon: MessageSquare,
                title: "Chat with Your Notes",
                description: "Ask questions about your notes and get instant AI-powered answers to deepen your understanding and clarify concepts.",
                gradient: "from-indigo-500 to-purple-500",
                delay: 0.4
              },
              {
                icon: Award,
                title: "Achievement System",
                description: "Stay motivated with gamified learning achievements, milestones, and rewards that celebrate your academic progress.",
                gradient: "from-yellow-500 to-orange-500",
                delay: 0.5
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.8,
                  delay: feature.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 100
                }}
                style={{ willChange: 'transform, opacity' }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl hover:border-indigo-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Hover effect line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-3xl"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive demo section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 text-center"
          >
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl cursor-pointer group hover:border-indigo-400/50 transition-all duration-300">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Play className="w-6 h-6 text-indigo-400" />
              </motion.div>
              <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                Watch 2-minute product demo
              </span>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </motion.div>
        </div>
      </section>



      {/* Enhanced Footer */}
      <footer className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800/50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,119,198,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.03),transparent_50%)]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl mb-8">
              <Rocket className="w-6 h-6 text-indigo-400" />
              <span className="text-slate-300 font-medium">Ready to transform your learning?</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start your free trial today
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join thousands of students who are already using AI to accelerate their academic success.
            </p>
            <div className="flex gap-4">
              <motion.button
                onClick={() => navigate('/auth-form', { state: { tab: 'register' } })}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Get Started Free
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="px-8 py-4 bg-slate-800/60 backdrop-blur-xl border-2 border-slate-600/40 text-white font-bold rounded-2xl hover:bg-slate-700/60 hover:border-slate-500/50 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  backgroundColor: "rgba(51, 65, 85, 0.7)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                View Plans
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <img src="/logo.png" alt="Impify" className="w-6 h-6 sm:w-8 sm:h-8" />
                </motion.div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Impify
                  </span>
                  <div className="text-xs text-slate-400">AI Study Platform</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Transform your learning with cutting-edge AI technology. Study smarter, not harder.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: Github, href: "#", color: "hover:text-slate-300" },
                  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
                  { icon: Linkedin, href: "#", color: "hover:text-blue-500" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`text-slate-500 ${social.color} transition-colors p-2 rounded-lg hover:bg-slate-800/50`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: "Product",
                links: [
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#" },
                  { name: "API", href: "#" },
                  { name: "Mobile App", href: "#" }
                ]
              },
              {
                title: "Company",
                links: [
                  { name: "About", href: "#" },
                  { name: "Blog", href: "#" },
                  { name: "Careers", href: "#" },
                  { name: "Press", href: "#" }
                ]
              },
              {
                title: "Support",
                links: [
                  { name: "Help Center", href: "#" },
                  { name: "Contact", href: "#" },
                  { name: "Privacy", href: "#" },
                  { name: "Terms", href: "#" }
                ]
              }
            ].map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
              >
                <h4 className="text-white font-bold text-lg mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                    >
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-8 border-t border-slate-800/50"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-slate-400 text-sm">
                © 2024 Impify. All rights reserved. Made with ❤️ for students worldwide.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  All systems operational
                </span>
                <span>99.9% uptime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan="free"
      />
    </div>
  );
};

export default AuthLanding;