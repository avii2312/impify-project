import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const ConicAnimation = ({
  children,
  className,
  size = 200,
  colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
  speed = 3,
  ...props
}) => {
  const conicGradient = `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`;

  return (
    <div className={cn('relative', className)} {...props}>
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: conicGradient,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div
        className="absolute inset-4 rounded-full bg-card flex items-center justify-center shadow-inner"
        style={{
          background: 'radial-gradient(circle, hsl(var(--card)) 0%, hsl(var(--background)) 100%)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ConicBorder = ({
  children,
  className,
  colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'],
  speed = 4,
  thickness = 2,
  ...props
}) => {
  const conicGradient = `conic-gradient(from 0deg, ${colors.join(', ')}, ${colors[0]})`;

  return (
    <div className={cn('relative p-1', className)} {...props}>
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: conicGradient,
          padding: thickness,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="relative bg-card rounded-xl p-4 shadow-lg">
        {children}
      </div>
    </div>
  );
};