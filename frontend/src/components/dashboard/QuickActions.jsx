import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, BookOpen, FileQuestion } from 'lucide-react';

const QuickActions = React.memo(({ 
  onUploadClick, 
  onSetNoteType,
  className = '' 
}) => {
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleFlashcardsClick = React.useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  const handleAnalyzeClick = React.useCallback(() => {
    onSetNoteType('question_paper');
  }, [onSetNoteType]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const buttonVariants = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const iconVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const actionItems = [
    {
      id: 'upload',
      icon: Upload,
      label: 'Upload Notes',
      description: 'Generate AI-powered study material',
      primary: true,
      onClick: onUploadClick,
      gradient: 'from-blue-500 to-blue-600',
      gradientHover: 'from-blue-600 to-blue-700'
    },
    {
      id: 'flashcards',
      icon: BookOpen,
      label: 'Review Flashcards',
      description: 'Spaced repetition learning',
      primary: false,
      onClick: handleFlashcardsClick,
      gradient: 'from-purple-500 to-purple-600',
      gradientHover: 'from-purple-600 to-purple-700'
    },
    {
      id: 'analyze',
      icon: FileQuestion,
      label: 'Analyze Paper',
      description: 'AI-powered question analysis',
      primary: false,
      onClick: handleAnalyzeClick,
      gradient: 'from-green-500 to-green-600',
      gradientHover: 'from-green-600 to-green-700'
    }
  ];

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 via-transparent to-primary/10 rounded-full blur-2xl" />
      
      {/* Header */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-6 relative">
          Quick Actions
          <motion.div
            className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </h2>
      </motion.div>
      
      <motion.div className="space-y-4 relative z-10">
        {actionItems.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.div
              key={action.id}
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button
                  onClick={action.onClick}
                  className={`
                    w-full h-16 rounded-xl font-semibold transition-all duration-300 
                    flex items-center justify-center gap-3 group relative overflow-hidden
                    ${action.primary 
                      ? `bg-gradient-to-r ${action.gradient} hover:bg-gradient-to-r hover:${action.gradientHover} text-white shadow-lg` 
                      : 'border border-border text-foreground hover:bg-muted/10'
                    }
                  `}
                  aria-label={action.label}
                >
                  {/* Background shimmer effect for primary buttons */}
                  {action.primary && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: "100%",
                        transition: { duration: 0.8, ease: "easeInOut" }
                      }}
                    />
                  )}
                  
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className={`
                      w-5 h-5 relative z-10
                      ${action.primary ? 'text-white' : 'text-foreground'}
                    `}
                  >
                    <Icon size={20} />
                  </motion.div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col items-start text-left relative z-10">
                    <span className={`font-semibold text-sm ${action.primary ? 'text-white' : 'text-foreground'}`}>
                      {action.label}
                    </span>
                    <span className={`text-xs ${action.primary ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {action.description}
                    </span>
                  </div>
                  
                  {/* Hover arrow indicator */}
                  <motion.div
                    className={`absolute right-4 ${action.primary ? 'text-white/60' : 'text-muted-foreground'}`}
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.div>
                </Button>
              </motion.div>
              
              {/* Glow effect for primary button */}
              {action.primary && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-8 right-8 w-3 h-3 bg-primary/20 rounded-full"
        animate={{
          y: [-4, 4, -4],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-8 left-8 w-2 h-2 bg-accent/30 rounded-full"
        animate={{
          y: [4, -4, 4],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

export { QuickActions };