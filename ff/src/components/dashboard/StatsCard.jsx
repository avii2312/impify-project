import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

const StatsCard = React.memo(({ 
  icon: Icon, 
  label, 
  value, 
  subtext, 
  bgColor = 'bg-primary/10', 
  iconColor = 'text-primary',
  className = '',
  delay = 0
}) => {
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: delay + 0.2
      }
    }
  };

  const valueVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: delay + 0.4
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`
        bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-elevated 
        transition-all duration-300 cursor-pointer group overflow-hidden relative
        ${className}
      `}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
      />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            variants={iconVariants}
            className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center relative`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.5, duration: 0.3 }}
            />
          </motion.div>
          
          <motion.span 
            className="text-muted text-sm font-medium uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.6, duration: 0.3 }}
          >
            {label}
          </motion.span>
        </div>
        
        {/* Content Section */}
        <div className="space-y-2">
          <motion.div
            variants={valueVariants}
            className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
          >
            <AnimatedNumber
              value={typeof value === 'string' ? parseFloat(value.replace('%', '')) : value}
              fontStyle={{
                fontSize: 32,
                color: "inherit",
                fontWeight: "700",
                fontFamily: "inherit"
              }}
            />
          </motion.div>
          
          <motion.p 
            className="text-muted text-sm group-hover:text-muted-foreground transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.7, duration: 0.3 }}
          >
            {subtext}
          </motion.p>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ x: "-100%" }}
        whileHover={{ 
          x: "100%",
          transition: { duration: 0.8, ease: "easeInOut" }
        }}
      />
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

export { StatsCard };