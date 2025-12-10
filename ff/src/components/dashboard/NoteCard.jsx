import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, FileQuestion, Calendar, Trash2, Folder, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const NoteCard = React.memo(({
  note,
  onDelete,
  onMoveToFolder,
  folders = [],
  viewMode = 'grid',
  index = 0,
  className = ''
}) => {
  const navigate = useNavigate();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleClick = React.useCallback(() => {
    navigate(`/note/${note.id}`);
  }, [navigate, note.id]);

  const handleDeleteClick = React.useCallback((e) => {
    e.stopPropagation();
    onDelete(note.id, e);
  }, [note.id, onDelete]);

  const handleMoveToFolder = React.useCallback((folderId) => {
    if (onMoveToFolder) {
      onMoveToFolder(note.id, folderId);
    }
  }, [note.id, onMoveToFolder]);

  const folderColors = React.useMemo(() => [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500', text: 'text-blue-100' },
    { name: 'Green', value: 'green', bg: 'bg-green-500', text: 'text-green-100' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500', text: 'text-purple-100' },
    { name: 'Red', value: 'red', bg: 'bg-red-500', text: 'text-red-100' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-900' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-500', text: 'text-pink-100' },
    { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-100' },
    { name: 'Teal', value: 'teal', bg: 'bg-teal-500', text: 'text-teal-100' }
  ], []);

  const getFolderColor = React.useCallback((color) => {
    return folderColors.find(c => c.value === color) || folderColors[0];
  }, [folderColors]);

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

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1 + 0.3
      }
    }
  };

  const hoverVariants = {
    rest: { 
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { 
      scale: 1.02,
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const deleteButtonVariants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 200
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover="hover"
      className={`
        bg-card border border-border rounded-xl shadow-soft hover:shadow-elevated
        hover:border-primary/50 transition-all duration-300 cursor-pointer group
        relative overflow-hidden perspective-1000 ${className}
        ${viewMode === 'list' ? 'p-4' : 'p-6'}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View note: ${note.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0"
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 1, transition: { duration: 0.3 } }
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      
      {/* Main content */}
      <motion.div variants={contentVariants} className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <motion.div
            variants={badgeVariants}
            className="relative"
          >
            <motion.span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-3 h-3" />
              {label}
            </motion.span>
          </motion.div>

          <motion.div variants={deleteButtonVariants} className="flex items-center gap-2">
            {folders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-foreground p-2 rounded-lg"
                    aria-label="More actions"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                    Move to folder
                  </div>
                  {folders.map((folder) => {
                    const color = getFolderColor(folder.color);
                    return (
                      <DropdownMenuItem
                        key={folder.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToFolder(folder.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-3 h-3 rounded ${color.bg}`}></div>
                        <span className="truncate">{folder.name}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              onClick={handleDeleteClick}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:bg-destructive/10 p-2 rounded-lg"
              aria-label={`Delete note: ${note.title}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </Button>
          </motion.div>
        </div>

        {/* Title Section */}
        <motion.h3 
          className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
          whileHover={{ x: 4, transition: { duration: 0.2 } }}
        >
          {note.title}
        </motion.h3>

        {/* Content Preview */}
        <motion.p 
          className="text-sm text-muted-foreground mb-4 line-clamp-3 group-hover:text-foreground transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
        >
          {contentPreview}
        </motion.p>

        {/* Footer */}
        <motion.div 
          className="flex items-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.6, duration: 0.3 }}
        >
          <Calendar size={14} className="group-hover:text-primary transition-colors duration-300" />
          {formatDate(note.created_at)}
        </motion.div>
      </motion.div>

      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 pointer-events-none"
        variants={{
          rest: { x: "-100%" },
          hover: { 
            x: "100%",
            transition: { duration: 0.8, ease: "easeInOut" }
          }
        }}
      />

      {/* 3D transform effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent opacity-0 pointer-events-none"
        variants={{
          rest: { opacity: 0 },
          hover: { 
            opacity: 1,
            transition: { duration: 0.3 }
          }
        }}
        style={{
          transform: 'rotateX(1deg)',
          transformOrigin: 'bottom center'
        }}
      />
    </motion.div>
  );
});

NoteCard.displayName = 'NoteCard';

export { NoteCard };