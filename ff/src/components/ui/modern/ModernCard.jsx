import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const ModernCard = React.forwardRef(({ 
  children, 
  className, 
  variant = 'default',
  hover = 'lift',
  glass = false,
  gradient = false,
  animate = true,
  delay = 0,
  ...props 
}, ref) => {
  const baseClasses = cn(
    'rounded-xl transition-all duration-300 shadow-md hover:shadow-lg',
    {
      // Variants
      'bg-card border border-border': variant === 'default',
      'bg-muted/50 border border-border/50 backdrop-blur-sm': variant === 'subtle',
      'bg-primary/10 border border-primary/20': variant === 'accent',

      // Hover effects
      'hover:-translate-y-1 hover:shadow-xl': hover === 'lift',
      'hover:shadow-glow hover:border-primary/50': hover === 'glow',
      'hover:scale-105': hover === 'scale',
      'hover:rotate-1': hover === 'rotate',

      // Glass morphism
      'glass-card': glass,

      // Gradients
      'bg-gradient-to-br from-primary/20 to-accent/20': gradient === 'primary',
      'bg-gradient-to-br from-secondary/20 to-muted/20': gradient === 'secondary',
      'bg-gradient-to-br from-accent/20 to-primary/20': gradient === 'accent',
      'bg-gradient-to-br from-background to-muted/30': gradient === 'dark',
    },
    className
  );

  const cardContent = (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
});

ModernCard.displayName = 'ModernCard';