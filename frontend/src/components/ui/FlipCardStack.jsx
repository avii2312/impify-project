import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, FileQuestion, Calendar, ChevronRight } from 'lucide-react';

const FlipCardStack = ({ notes = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const scale = useTransform(x, [-200, -50, 0, 50, 200], [0.95, 0.98, 1, 0.98, 0.95]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.7, 0.9, 1, 0.9, 0.7]);

  const springX = useSpring(x, {
    stiffness: 400,
    damping: 40,
    mass: 0.8
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event, info) => {
    setDragDirection(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const swipeThreshold = 80; // Increased threshold for better control
    const velocity = info.velocity.x;

    // Consider both distance and velocity for more natural swiping
    const shouldSwipeLeft = (info.offset.x < -swipeThreshold) || (velocity < -500 && Math.abs(info.offset.x) > 30);
    const shouldSwipeRight = (info.offset.x > swipeThreshold) || (velocity > 500 && Math.abs(info.offset.x) > 30);

    if (shouldSwipeRight && currentIndex > 0) {
      // Swipe right - go to previous card
      setCurrentIndex(currentIndex - 1);
    } else if (shouldSwipeLeft && currentIndex < notes.length - 1) {
      // Swipe left - go to next card
      setCurrentIndex(currentIndex + 1);
    }

    // Smooth return animation
    x.set(0);
    setDragDirection(0);
  };

  const handleCardClick = (noteId) => {
    if (!isDragging) {
      navigate(`/note/${noteId}`);
    }
  };

  const handleKeyDown = (event) => {
    if (isDragging) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex < notes.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (notes[currentIndex]) {
          navigate(`/note/${notes[currentIndex].id}`);
        }
        break;
    }
  };

  // Add keyboard event listeners
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isDragging, notes]);

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
          <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Recent Notes</h3>
          <p className="text-slate-400">Upload some documents to see your notes here!</p>
        </div>
      </div>
    );
  }

  const currentNote = notes[currentIndex];
  const { bgColor, textColor, borderColor, icon: Icon, label } = getBadgeConfig(currentNote);

  return (
    <div className="relative" ref={constraintsRef}>
      {/* Card Stack Background */}
      <div className="relative h-96 mb-8">
        {/* Background cards for stack effect */}
        {notes.slice(0, 3).map((_, index) => {
          const stackIndex = index;
          const isActive = stackIndex === currentIndex;
          const offset = (notes.length - 1 - stackIndex) * 8;

          return (
            <motion.div
              key={`stack-${stackIndex}`}
              className="absolute inset-0"
              style={{
                zIndex: notes.length - stackIndex,
                x: isActive ? springX : 0,
                rotate: isActive ? rotate : 0,
                scale: isActive ? scale : 1 - (stackIndex * 0.05),
                opacity: isActive ? opacity : 0.3 - (stackIndex * 0.1),
              }}
              animate={{
                y: offset,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: stackIndex * 0.1
              }}
            >
              <motion.div
                className={`w-full h-full bg-white/5 backdrop-blur-xl border rounded-3xl shadow-2xl cursor-pointer transition-all duration-200 ${
                  isActive && isDragging
                    ? 'border-blue-400/50 shadow-blue-500/20'
                    : 'border-white/10'
                }`}
                drag={isActive}
                dragConstraints={constraintsRef}
                dragElastic={0.15}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                onClick={() => handleCardClick(notes[stackIndex]?.id)}
                whileHover={!isDragging ? { scale: 1.02, y: -4 } : {}}
                whileTap={!isDragging ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: borderColor
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </motion.span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl font-bold text-white mb-4 line-clamp-2 flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {notes[stackIndex]?.title || 'Untitled Note'}
                  </motion.h3>

                  {/* Content Preview */}
                  <motion.p
                    className="text-slate-300 mb-6 line-clamp-3 flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {notes[stackIndex]?.content?.substring(0, 150) || 'No content available...'}
                  </motion.p>

                  {/* Footer */}
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Calendar size={16} />
                      {formatDate(notes[stackIndex]?.created_at)}
                    </div>
                    <motion.div
                      className="flex items-center gap-1 text-blue-400"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-sm font-medium">View Note</span>
                      <ChevronRight size={16} />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-4">
        {notes.map((_, index) => (
          <motion.button
            key={index}
            className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-blue-500 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Progress indicator during drag */}
            {isDragging && index === currentIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/50"
                initial={{ scale: 0 }}
                animate={{
                  scale: Math.abs(dragDirection) / 200,
                  opacity: Math.abs(dragDirection) / 200
                }}
                transition={{ duration: 0.1 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Card Counter */}
      <div className="text-center">
        <span className="text-slate-400 text-sm">
          {currentIndex + 1} of {notes.length} notes
        </span>
      </div>

      {/* Drag Instruction */}
      <motion.div
        className="text-center mt-4 space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.p
          className="text-slate-500 text-xs"
          animate={isDragging ? {
            scale: [1, 1.05, 1],
            color: dragDirection > 50 ? '#60a5fa' : dragDirection < -50 ? '#60a5fa' : '#94a3b8'
          } : {}}
          transition={{ duration: 0.2 }}
        >
          {isDragging
            ? (dragDirection > 50 ? '← Previous note' : dragDirection < -50 ? 'Next note →' : '← Drag to flip through notes →')
            : '← Drag to flip through notes →'
          }
        </motion.p>
        <p className="text-slate-600 text-xs">Use ← → arrow keys or click dots</p>
      </motion.div>
    </div>
  );
};

export { FlipCardStack };