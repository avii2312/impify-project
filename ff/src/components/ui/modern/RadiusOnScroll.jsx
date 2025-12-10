import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export const RadiusOnScroll = ({
  children,
  className,
  baseRadius = 0,
  maxRadius = 50,
  ...props
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const radius = Math.min(maxRadius, baseRadius + scrollY * 0.1);

  return (
    <motion.div
      className={cn('transition-all duration-300 ease-out', className)}
      style={{
        borderRadius: `${radius}px`,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const DynamicRadiusCard = ({
  children,
  className,
  ...props
}) => {
  const { scrollYProgress } = useScroll();
  const borderRadius = useTransform(scrollYProgress, [0, 1], [8, 32]);

  return (
    <motion.div
      className={cn(
        'bg-card border border-border shadow-lg p-6 transition-all duration-300',
        className
      )}
      style={{ borderRadius }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MorphingShape = ({
  children,
  className,
  shapes = ['rounded-lg', 'rounded-2xl', 'rounded-3xl', 'rounded-full'],
  ...props
}) => {
  const { scrollYProgress } = useScroll();
  const shapeIndex = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 0]);

  return (
    <motion.div
      className={cn('bg-primary/10 border border-primary/20 p-6 transition-all duration-500', className)}
      style={{
        borderRadius: shapes[Math.round(shapeIndex.get())] || shapes[0]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};