import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  BrainCircuit,
  Search,
  Plus,
  Shuffle,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Flame,
  Trophy,
  Clock,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Flip card component
const FlipCard = ({ flashcard, isFlipped, onFlip }) => {
  return (
    <div
      onClick={onFlip}
      className="relative w-full aspect-[4/3] cursor-pointer perspective-1000"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full h-full relative preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 flex flex-col items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs text-white/40 uppercase tracking-wider mb-4">Question</span>
          <p className="text-xl md:text-2xl font-medium text-white text-center leading-relaxed">
            {flashcard.question || flashcard.front}
          </p>
          <span className="absolute bottom-6 text-xs text-white/30">Tap to reveal answer</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border border-indigo-500/20 p-8 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs text-indigo-300/60 uppercase tracking-wider mb-4">Answer</span>
          <p className="text-xl md:text-2xl font-medium text-white text-center leading-relaxed">
            {flashcard.answer || flashcard.back}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Study mode component
const StudyMode = ({ flashcards, onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });
  const [completed, setCompleted] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleAnswer = (correct) => {
    setResults(prev => ({
      ...prev,
      [correct ? 'correct' : 'incorrect']: prev[correct ? 'correct' : 'incorrect'] + 1
    }));

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    const accuracy = Math.round((results.correct / flashcards.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      >
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-white/10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy size={40} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
          <p className="text-white/50 mb-6">Great job studying your flashcards</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-white">{flashcards.length}</p>
              <p className="text-xs text-white/40">Cards</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10">
              <p className="text-2xl font-bold text-emerald-400">{results.correct}</p>
              <p className="text-xs text-emerald-400/60">Correct</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10">
              <p className="text-2xl font-bold text-red-400">{results.incorrect}</p>
              <p className="text-xs text-red-400/60">Incorrect</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/50">Accuracy</span>
              <span className="text-sm font-medium text-white">{accuracy}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${accuracy}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full rounded-full ${
                  accuracy >= 80 ? 'bg-emerald-500' :
                  accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {
                setCurrentIndex(0);
                setIsFlipped(false);
                setResults({ correct: 0, incorrect: 0 });
                setCompleted(false);
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <RotateCcw size={18} className="mr-2" />
              Study Again
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
            >
              Done
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
          Exit
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle size={16} />
            <span className="text-sm">{results.correct}</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <XCircle size={16} />
            <span className="text-sm">{results.incorrect}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <FlipCard
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 md:p-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          {isFlipped ? (
            <div className="flex gap-4">
              <Button
                onClick={() => handleAnswer(false)}
                className="flex-1 py-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
              >
                <XCircle size={20} className="mr-2" />
                Incorrect
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                className="flex-1 py-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
              >
                <CheckCircle size={20} className="mr-2" />
                Correct
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsFlipped(true)}
              className="w-full py-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
            >
              Show Answer
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Flashcard preview card
const FlashcardPreview = ({ flashcard, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/30 transition-all">
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
          {index + 1}
        </div>

        <p className="text-white/80 font-medium line-clamp-2 mb-2">
          {flashcard.question || flashcard.front}
        </p>
        <p className="text-sm text-white/40 line-clamp-2">
          {flashcard.answer || flashcard.back}
        </p>
      </div>
    </motion.div>
  );
};

// Stats card
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-white/40">{label}</p>
  </div>
);

const Flashcards = () => {
  const { flashcards, refreshData } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const filteredFlashcards = useMemo(() => {
    if (!searchTerm) return flashcards || [];
    const term = searchTerm.toLowerCase();
    return (flashcards || []).filter(card =>
      (card.question || card.front)?.toLowerCase().includes(term) ||
      (card.answer || card.back)?.toLowerCase().includes(term)
    );
  }, [flashcards, searchTerm]);

  const handleStartStudy = (cards = filteredFlashcards) => {
    if (cards.length === 0) return;
    setSelectedCards(cards);
    setStudyMode(true);
  };

  const shuffleAndStudy = () => {
    const shuffled = [...filteredFlashcards].sort(() => Math.random() - 0.5);
    handleStartStudy(shuffled);
  };

  // Calculate stats
  const totalCards = flashcards?.length || 0;
  const masteredCards = flashcards?.filter(c => (c.correct_count || 0) >= 3).length || 0;
  const accuracy = totalCards > 0
    ? Math.round((flashcards.reduce((acc, c) => acc + (c.correct_count || 0), 0) /
        Math.max(1, flashcards.reduce((acc, c) => acc + (c.review_count || 0), 0))) * 100)
    : 0;

  return (
    <>
      <AnimatePresence>
        {studyMode && (
          <StudyMode
            flashcards={selectedCards}
            onClose={() => setStudyMode(false)}
            onComplete={() => {
              setStudyMode(false);
              refreshData();
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen bg-[#0a0a0f]">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <BrainCircuit size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">Flashcards</h1>
                <p className="text-white/50 mt-1">{totalCards} cards ready to study</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={shuffleAndStudy}
                disabled={filteredFlashcards.length === 0}
                className="bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <Shuffle size={18} className="mr-2" />
                Shuffle
              </Button>
              <Button
                onClick={() => handleStartStudy()}
                disabled={filteredFlashcards.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                <Play size={18} className="mr-2" />
                Study All
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <StatCard
              icon={BrainCircuit}
              label="Total Cards"
              value={totalCards}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={Trophy}
              label="Mastered"
              value={masteredCards}
              color="from-amber-500 to-orange-500"
            />
            <StatCard
              icon={Target}
              label="Accuracy"
              value={`${accuracy}%`}
              color="from-emerald-500 to-teal-500"
            />
            <StatCard
              icon={Flame}
              label="To Review"
              value={totalCards - masteredCards}
              color="from-red-500 to-orange-500"
            />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={16} className="text-white/50" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Flashcards Grid */}
          {filteredFlashcards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  <BrainCircuit size={40} className="text-white/20" />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No flashcards found' : 'No flashcards yet'}
              </h3>
              <p className="text-white/40 text-center max-w-sm mb-6">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Upload a document to generate flashcards automatically'
                }
              </p>

              <Button
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                <Plus size={18} className="mr-2" />
                Create Flashcards
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredFlashcards.map((flashcard, idx) => (
                <FlashcardPreview
                  key={flashcard.id || flashcard._id || idx}
                  flashcard={flashcard}
                  index={idx}
                  onClick={() => handleStartStudy([flashcard])}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default Flashcards;