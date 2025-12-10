import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Calendar } from 'lucide-react';

const StackedFlashcardAnimation = ({ flashcards = [] }) => {
  const navigate = useNavigate();

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

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Recent Flashcards</h3>
          <p className="text-muted-foreground">Generate flashcards from your notes to see them here!</p>
        </div>
      </div>
    );
  }

  // Show up to 3 flashcards in the stack
  const displayFlashcards = flashcards.slice(0, 3);

  return (
    <div className="flex justify-center items-center min-h-[450px] relative">
      <div className="relative w-full max-w-sm mx-auto">
        {displayFlashcards.map((flashcard, index) => {
          const isTopCard = index === 0;

          return (
            <motion.div
              key={flashcard.id}
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
                zIndex: displayFlashcards.length - index,
              }}
            >
              {/* Simplified single background layer */}
              <div className="absolute inset-0 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10" />

              {/* Main card */}
              <div
                className="relative z-10 p-6 rounded-2xl bg-white/12 backdrop-blur-sm border border-white/10 h-full flex flex-col shadow-md"
                onClick={() => isTopCard && navigate('/flashcards')}
              >
                {/* Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      borderColor: '#3b82f6'
                    }}
                  >
                    <Brain className="w-3 h-3" />
                    Flashcard
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 flex-1">
                  {flashcard.question || 'Flashcard Question'}
                </h3>

                {/* Answer Preview */}
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4 leading-relaxed">
                  {flashcard.answer?.substring(0, 100) || 'Answer will be revealed when studying...'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(flashcard.created_at)}
                  </div>
                  {isTopCard && (
                    <span className="text-primary font-medium">Start studying</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Flashcard count indicator */}
      {flashcards.length > 3 && (
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <span className="text-muted-foreground text-sm font-medium">
            +{flashcards.length - 3} more flashcards
          </span>
        </motion.div>
      )}
    </div>
  );
};

export { StackedFlashcardAnimation };