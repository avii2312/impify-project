import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TextHoverEffect = ({
  children,
  className,
  effect = 'lift', // lift, glow, gradient, scale, bounce, rotate
  duration = 0.3,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getHoverProps = () => {
    switch (effect) {
      case 'lift':
        return { y: -4, scale: 1.02 };
      case 'scale':
        return { scale: 1.1 };
      case 'bounce':
        return { y: [-2, -6, -2], transition: { duration: 0.5, repeat: Infinity } };
      case 'rotate':
        return { rotate: 5, scale: 1.05 };
      default:
        return { y: -2 };
    }
  };

  return (
    <motion.div
      className={cn('inline-block cursor-pointer select-none', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={getHoverProps()}
      transition={{ duration, type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      <motion.span
        animate={{
          textShadow: isHovered && effect === 'glow'
            ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)'
            : '0 0 0px rgba(59, 130, 246, 0)',
          filter: isHovered && effect === 'glow' ? 'brightness(1.1)' : 'brightness(1)'
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: effect === 'gradient'
            ? isHovered
              ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
              : 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--muted-foreground)) 100%)'
            : undefined,
          WebkitBackgroundClip: effect === 'gradient' ? 'text' : undefined,
          WebkitTextFillColor: effect === 'gradient' ? 'transparent' : undefined,
          backgroundClip: effect === 'gradient' ? 'text' : undefined
        }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
};

export const MagneticText = ({ children, className, ...props }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  return (
    <motion.div
      className={cn('inline-block cursor-pointer', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
      }}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};