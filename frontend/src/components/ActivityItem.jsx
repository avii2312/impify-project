import React from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, BookOpen, Upload, TrendingUp } from 'lucide-react';

export const ActivityItem = React.memo(({ title, description, timestamp, type, index = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const getIcon = () => {
    switch (type) {
      case 'note':
        return FileText;
      case 'flashcard':
        return BookOpen;
      case 'upload':
        return Upload;
      default:
        return TrendingUp;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'note':
        return {
          bg: 'from-blue-500 to-blue-600',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          glow: 'shadow-blue-500/20'
        };
      case 'flashcard':
        return {
          bg: 'from-purple-500 to-purple-600',
          text: 'text-purple-400',
          border: 'border-purple-500/20',
          glow: 'shadow-purple-500/20'
        };
      case 'upload':
        return {
          bg: 'from-green-500 to-green-600',
          text: 'text-green-400',
          border: 'border-green-500/20',
          glow: 'shadow-green-500/20'
        };
      default:
        return {
          bg: 'from-amber-500 to-amber-600',
          text: 'text-amber-400',
          border: 'border-amber-500/20',
          glow: 'shadow-amber-500/20'
        };
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'note':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'flashcard':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'upload':
        return 'bg-green-500/10 border-green-500/20';
      default:
        return 'bg-amber-500/10 border-amber-500/20';
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180 
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1 + 0.3
      }
    }
  };

  const hoverVariants = {
    rest: { 
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      y: -2,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const shimmerVariants = {
    hidden: { x: "-100%" },
    hover: {
      x: "100%",
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const colors = getTypeColor();
  const Icon = getIcon();

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      className={`
        flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 
        hover:bg-card cursor-pointer group relative overflow-hidden
        ${getIconBg()}
      `}
      style={{ borderColor: colors.border }}
    >
      {/* Background shimmer effect */}
      <motion.div
        variants={shimmerVariants}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
      />

      {/* Animated background glow */}
      <motion.div
        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colors.bg} opacity-0`}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 0.05 }
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <motion.div
        variants={iconVariants}
        className={`
          relative z-10 w-10 h-10 rounded-lg flex items-center justify-center
          bg-gradient-to-r ${colors.bg} ${colors.glow} shadow-lg
        `}
      >
        <Icon size={18} className="text-white" />
        
        {/* Icon pulse effect */}
        <motion.div
          className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colors.bg} opacity-30`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={contentVariants}
        className="flex-1 min-w-0 relative z-10"
      >
        <motion.p 
          className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1"
          whileHover={{ x: 2, transition: { duration: 0.2 } }}
        >
          {title}
        </motion.p>
        <motion.p 
          className="text-xs text-muted group-hover:text-muted-foreground transition-colors duration-300 line-clamp-1"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1, transition: { duration: 0.3 } }}
        >
          {description}
        </motion.p>
        <motion.p 
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: index * 0.1 + 0.5 }}
        >
          {timestamp}
        </motion.p>
      </motion.div>

      {/* Hover indicator */}
      <motion.div
        className={`w-2 h-2 rounded-full ${colors.bg.replace('from-', 'bg-').replace(' to-', '')} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
        whileHover={{ scale: 1.2 }}
      />

      {/* Floating particles */}
      <motion.div
        className="absolute top-2 right-2 w-1 h-1 bg-current rounded-full opacity-0 group-hover:opacity-20"
        animate={{
          y: [-2, 2, -2],
          opacity: [0, 0.2, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{ color: colors.text }}
      />

      {/* 3D border effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1 }
        }}
        style={{
          transform: 'rotateX(0.5deg)',
          transformOrigin: 'bottom center'
        }}
      />
    </motion.div>
  );
});

ActivityItem.displayName = 'ActivityItem';