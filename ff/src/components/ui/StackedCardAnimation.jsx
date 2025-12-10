import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, FileQuestion, Calendar } from 'lucide-react';

const StackedCardAnimation = ({ notes = [] }) => {
  const navigate = useNavigate();

  const getBadgeConfig = (note) => {
    const isQuestionPaper = note.note_type === 'question_paper';
    return {
      bgColor: isQuestionPaper ? 'rgba(244, 114, 182, 0.2)' : 'rgba(0, 255, 65, 0.2)',
      textColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      borderColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      icon: isQuestionPaper ? FileQuestion : FileText,
      label: isQuestionPaper ? 'Question Paper' : 'General Notes'
    };
  };

  const formatDate = (dateStr) => {
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
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Recent Notes</h3>
          <p className="text-muted-foreground">Upload some documents to see your notes here!</p>
        </div>
      </div>
    );
  }

  // Show up to 3 notes in the stack
  const displayNotes = notes.slice(0, 3);

  return (
    <div className="flex justify-center items-center min-h-[450px] relative">
      <div className="relative w-full max-w-sm mx-auto">
        {displayNotes.map((note, index) => {
          const { bgColor, textColor, borderColor, icon: Icon, label } = getBadgeConfig(note);
          const isTopCard = index === 0;

          return (
            <motion.div
              key={note.id}
              className="absolute inset-0 cursor-pointer"
              initial={{ opacity: 0, y: 20, rotate: index * 0.5 }}
              animate={{ opacity: 1, y: 0, rotate: index * 0.5 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{
                y: -8 - (index * 2),
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              style={{
                zIndex: displayNotes.length - index,
              }}
            >
              {/* Simplified single background layer */}
              <div className="absolute inset-0 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10" />

              {/* Main card */}
              <div
                className="relative z-10 p-6 rounded-2xl bg-white/12 backdrop-blur-sm border border-white/10 h-full flex flex-col shadow-md"
                onClick={() => isTopCard && navigate(`/note/${note.id}`)}
              >
                {/* Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderColor: borderColor
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 flex-1">
                  {note.title || 'Untitled Note'}
                </h3>

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4 leading-relaxed">
                  {note.content?.substring(0, 120) || 'No content available...'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(note.created_at)}
                  </div>
                  {isTopCard && (
                    <span className="text-primary font-medium">Click to view</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Note count indicator */}
      {notes.length > 3 && (
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="text-muted-foreground text-sm font-medium">
            +{notes.length - 3} more notes
          </span>
        </motion.div>
      )}
    </div>
  );
};

export { StackedCardAnimation };