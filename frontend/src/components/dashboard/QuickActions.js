import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Upload, BookOpen, FileQuestion } from 'lucide-react';

const QuickActions = React.memo(({
  onUploadClick,
  onSetNoteType,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleFlashcardsClick = React.useCallback(() => {
    navigate('/chat');
  }, [navigate]);

  const handleAnalyzeClick = React.useCallback(() => {
    onSetNoteType('question_paper');
  }, [onSetNoteType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div
      className={`bg-card border border-border rounded-xl p-6 shadow-soft ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-xl font-bold text-foreground mb-6"
        variants={itemVariants}
      >
        Quick Actions
      </motion.h2>
      <motion.div className="space-y-4" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Button
            onClick={onUploadClick}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
            aria-label="Upload notes to generate AI-powered study material"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-5 h-5" />
            </motion.div>
            Upload Notes
          </Button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            onClick={handleFlashcardsClick}
            className="w-full border-border text-foreground hover:bg-card py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
            aria-label="Review flashcards for better learning"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="w-5 h-5" />
            </motion.div>
            Review Flashcards
          </Button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            onClick={handleAnalyzeClick}
            className="w-full border-border text-foreground hover:bg-card py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
            aria-label="Analyze question papers with AI"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FileQuestion className="w-5 h-5" />
            </motion.div>
            Analyze Paper
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

export { QuickActions };