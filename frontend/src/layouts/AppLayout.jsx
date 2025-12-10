import React from "react";
import { Outlet } from "react-router-dom";
import GlobalDock from "@/components/ui/GlobalDock";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* Global background effects */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(0,0,0,0))]" />

        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] animate-float-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-indigo-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-[60px] animate-spin-very-slow" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Main content area with bottom padding for dock */}
      <main className="relative z-10 pb-24 md:pb-28">
        <Outlet />
      </main>

      {/* Global navigation dock */}
      <GlobalDock />

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-30px) translateX(20px);
            opacity: 0.15;
          }
        }

        @keyframes float-slow-delayed {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          50% {
            transform: translateY(25px) translateX(-15px);
            opacity: 0.12;
          }
        }

        @keyframes spin-very-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slow-delayed {
          animation: float-slow-delayed 25s ease-in-out infinite;
          animation-delay: -10s;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 120s linear infinite;
        }

        /* Smooth page transitions */
        .page-transition-enter {
          opacity: 0;
          transform: translateY(10px);
        }

        .page-transition-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }

        .page-transition-exit {
          opacity: 1;
          transform: translateY(0);
        }

        .page-transition-exit-active {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 200ms ease-in, transform 200ms ease-in;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 15, 23, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Selection color */
        ::selection {
          background: rgba(99, 102, 241, 0.3);
          color: white;
        }

        /* Focus ring */
        :focus-visible {
          outline: 2px solid rgba(99, 102, 241, 0.5);
          outline-offset: 2px;
        }

        /* Smooth anchor scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default AppLayout;