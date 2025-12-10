import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, RotateCcw, BookOpen, Brain } from 'lucide-react';

export default function Flashcard({ 
  flashcard, 
  onReview, 
  showAnswer = false, 
  disableInteractions = false,
  className = "",
  isMobile = false 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Motion values for advanced 3D effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  // Viewport detection for entrance animations
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleFlip = () => {
    if (!disableInteractions && !isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      handleFlip();
    }
  };

  // Mouse/touch movement for 3D effect
  const handleMouseMove = (event) => {
    if (disableInteractions || isMobile) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleReview = (wasCorrect) => {
    if (!hasReviewed) {
      setHasReviewed(true);
      onReview(wasCorrect);
    }
  };

  const difficultyColor = (score) => {
    if (score <= 0.3) return { 
      bg: 'from-green-400 to-emerald-500', 
      text: 'text-green-600 dark:text-green-400', 
      label: 'Easy',
      glow: 'shadow-green-500/30'
    };
    if (score <= 0.6) return { 
      bg: 'from-yellow-400 to-orange-500', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      label: 'Medium',
      glow: 'shadow-yellow-500/30'
    };
    return { 
      bg: 'from-red-400 to-pink-500', 
      text: 'text-red-600 dark:text-red-400', 
      label: 'Hard',
      glow: 'shadow-red-500/30'
    };
  };

  const difficulty = difficultyColor(flashcard.difficulty_score || 0);

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { 
      rotateY: 0,
      scale: 1
    },
    visible: { 
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  const flipVariants = {
    front: { rotateY: 0, zIndex: 10 },
    back: { rotateY: 180, zIndex: 5 }
  };

  const difficultyBadgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const successVariants = {
    hidden: { scale: 0, y: 20 },
    visible: { 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className={`flashcard-container ${isMobile ? 'mobile-optimized' : ''} perspective-1000 ${className}`}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative w-full h-full"
        style={{ perspective: 1000 }}
      >
        <motion.div
          ref={containerRef}
          className="flashcard-3d relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={!isMobile ? handleFlip : undefined}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          variants={cardVariants}
          animate={isFlipped ? "back" : "front"}
        >
          {/* Front of card (Question) */}
          <motion.div
            className="flashcard-face flashcard-front absolute inset-0"
            variants={flipVariants}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Card className="w-full h-full bg-card border border-border rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden relative">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <motion.div 
                  className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </div>

              <CardContent className="p-6 sm:p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                <motion.div 
                  className="mb-4 sm:mb-6 relative z-10"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    variants={difficultyBadgeVariants}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${difficulty.bg} text-white shadow-lg ${difficulty.glow}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={16} className="mr-2" />
                    Question
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6 leading-relaxed relative z-10 px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {flashcard.question}
                </motion.h3>
                
                {flashcard.difficulty_score !== undefined && (
                  <motion.div 
                    className="mt-auto relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span className={`text-sm font-semibold ${difficulty.text} bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-border`}>
                        {difficulty.label} • {flashcard.review_count || 0} reviews
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Mobile tap hint */}
                {isMobile && (
                  <motion.div 
                    className="absolute bottom-2 right-2 opacity-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.div 
                      className="flex flex-col items-center text-xs text-muted-foreground"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <RotateCcw size={12} />
                      <span>Tap to flip</span>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Back of card (Answer) */}
          <motion.div
            className="flashcard-face flashcard-back absolute inset-0"
            variants={flipVariants}
            style={{ 
              transformStyle: "preserve-3d",
              transform: "rotateY(180deg)"
            }}
          >
            <Card className="w-full h-full bg-card border border-border rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-500 overflow-hidden relative">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <motion.div 
                  className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute bottom-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>

              <CardContent className="p-6 sm:p-8 h-full flex flex-col justify-center relative overflow-hidden">
                <motion.div 
                  className="mb-4 sm:mb-6 relative z-10"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                    variants={difficultyBadgeVariants}
                  >
                    <Brain size={16} className="mr-2" />
                    Answer
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed mb-6 sm:mb-8 relative z-10 px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {flashcard.answer}
                </motion.p>
                
                <AnimatePresence>
                  {!hasReviewed && !disableInteractions && showAnswer && (
                    <motion.div 
                      className="mt-auto flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <motion.div variants={buttonVariants}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReview(false);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <XCircle size={18} className="mr-2" />
                          <span className="hidden sm:inline">Needs Review</span>
                          <span className="sm:hidden">Hard</span>
                        </Button>
                      </motion.div>
                      
                      <motion.div variants={buttonVariants}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReview(true);
                          }}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={18} className="mr-2" />
                          <span className="hidden sm:inline">Got It!</span>
                          <span className="sm:hidden">Easy</span>
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {hasReviewed && (
                    <motion.div 
                      className="mt-auto text-center relative z-10"
                      variants={successVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <motion.div 
                        className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-semibold shadow-md"
                        animate={{
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 4px 6px rgba(0, 0, 0, 0.1)",
                            "0 8px 25px rgba(34, 197, 94, 0.3)",
                            "0 4px 6px rgba(0, 0, 0, 0.1)"
                          ]
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Review recorded!
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {flashcard.correct_ratio !== undefined && flashcard.review_count > 0 && (
                  <motion.div 
                    className="mt-3 text-center relative z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-border">
                      Success rate: {Math.round(flashcard.correct_ratio * 100)}%
                    </span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}