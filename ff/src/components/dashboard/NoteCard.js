import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, FileQuestion, Calendar, Trash2 } from 'lucide-react';

const NoteCard = React.memo(({
  note,
  onDelete,
  index = 0,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleClick = React.useCallback(() => {
    navigate(`/note/${note.id}`);
  }, [navigate, note.id]);

  const handleDeleteClick = React.useCallback((e) => {
    e.stopPropagation();
    onDelete(note.id, e);
  }, [note.id, onDelete]);

  const formatDate = React.useMemo(() => (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const contentPreview = React.useMemo(() => {
    return note.content?.substring(0, 120) || 'No content available...';
  }, [note.content]);

  const badgeConfig = React.useMemo(() => {
    const isQuestionPaper = note.note_type === 'question_paper';
    return {
      bgColor: isQuestionPaper ? 'rgba(244, 114, 182, 0.2)' : 'rgba(0, 255, 65, 0.2)',
      textColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      borderColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      icon: isQuestionPaper ? FileQuestion : FileText,
      label: isQuestionPaper ? 'Question Paper' : 'General Notes'
    };
  }, [note.note_type]);

  const { bgColor, textColor, borderColor, icon: Icon, label } = badgeConfig;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: index * 0.1 + 0.2 }
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={`bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={`View note: ${note.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <motion.div variants={badgeVariants}>
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`
            }}
          >
            <Icon className="w-3 h-3" />
            {label}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:bg-destructive/10 p-1"
            aria-label={`Delete note: ${note.title}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </Button>
        </motion.div>
      </div>

      <motion.h3
        className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
      >
        {note.title}
      </motion.h3>

      <motion.p
        className="text-sm text-muted-foreground mb-4 line-clamp-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
      >
        {contentPreview}
      </motion.p>

      <motion.div
        className="flex items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.6 }}
      >
        <Calendar size={14} />
        {formatDate(note.created_at)}
      </motion.div>
    </motion.div>
  );
});

NoteCard.displayName = 'NoteCard';

export { NoteCard };