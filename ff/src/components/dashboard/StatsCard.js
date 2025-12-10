import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

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
  return (
    <motion.div
      className={`bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/50 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{
        scale: 1.03,
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </motion.div>
        <motion.span
          className="text-muted text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {label}
        </motion.span>
      </div>
      <div className="space-y-2">
        <motion.h3
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.h3>
        <motion.p
          className="text-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          {subtext}
        </motion.p>
      </div>
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

export { StatsCard };