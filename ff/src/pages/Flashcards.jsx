import React, { useState, useEffect, useRef, useMemo } from "react";
import FlipCard from "@/components/FlipCard";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { ENDPOINTS } from "@/api/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Plus,
  Brain,
  ArrowLeft,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Play,
  Pause,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap
} from "lucide-react";

const Flashcards = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyMode, setStudyMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    totalReviewed: 0,
    streak: 0
  });
  const [cardResults, setCardResults] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [viewMode, setViewMode] = useState('collections'); // 'collections' or 'study'

  // Scroll progress for reading progress bar
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.flashcards);
      setFlashcards(response.data.flashcards || []);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  // Group flashcards by their source note
  const collections = useMemo(() => {
    const grouped = {};
    flashcards.forEach(card => {
      const sourceId = card.note_id;
      const sourceTitle = card.note_title || 'Unknown Note';
      const sourceType = card.note_type || 'general';

      if (!grouped[sourceId]) {
        grouped[sourceId] = {
          id: sourceId,
          title: sourceTitle,
          type: sourceType,
          flashcards: [],
          totalCards: 0,
          createdAt: card.created_at
        };
      }
      grouped[sourceId].flashcards.push(card);
      grouped[sourceId].totalCards = grouped[sourceId].flashcards.length;
    });

    return Object.values(grouped).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [flashcards]);

  // Get flashcards for selected collection
  const selectedCollectionCards = useMemo(() => {
    if (!selectedCollection) return [];
    return flashcards.filter(card => card.note_id === selectedCollection.id);
  }, [selectedCollection, flashcards]);

  const generateFlashcards = async () => {
    try {
      setGenerating(true);
      toast.info('Select a note from the Notes page to generate flashcards');
      navigate('/notes');
    } catch (error) {
      toast.error('Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  const deleteFlashcard = async (flashcardId) => {
    try {
      await axiosInstance.delete(ENDPOINTS.flashcardsDelete(flashcardId));
      setFlashcards(prev => prev.filter(card => card.id !== flashcardId));
      toast.success('Flashcard deleted');
    } catch (error) {
      toast.error('Failed to delete flashcard');
    }
  };

  const handleCardResponse = (correct) => {
    const cardId = flashcards[currentCardIndex]?.id;
    setCardResults(prev => ({
      ...prev,
      [cardId]: correct ? 'correct' : 'incorrect'
    }));

    setStudyStats(prev => ({
      ...prev,
      [correct ? 'correct' : 'incorrect']: prev[correct ? 'correct' : 'incorrect'] + 1,
      totalReviewed: prev.totalReviewed + 1,
      streak: correct ? prev.streak + 1 : 0
    }));

    setShowAnswer(false);

    // Auto-advance to next card after a short delay
    setTimeout(() => {
      if (currentCardIndex < selectedCollectionCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // Study session complete
        toast.success('Study session complete! Great job! 🎉');
        setStudyMode(false);
      }
    }, 1000);
  };

  const resetStudySession = () => {
    setStudyStats({ correct: 0, incorrect: 0, totalReviewed: 0, streak: 0 });
    setCardResults({});
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const progressPercentage = selectedCollectionCards.length > 0
    ? ((currentCardIndex + 1) / selectedCollectionCards.length) * 100
    : 0;

  const accuracyPercentage = studyStats.totalReviewed > 0
    ? Math.round((studyStats.correct / studyStats.totalReviewed) * 100)
    : 0;

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
          <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
        </div>

        <div className="flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <div className="spinner mb-4"></div>
            <p className="text-muted-foreground">Loading your flashcards...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Reading Progress Bar */}
      <motion.div
        style={{ scaleX: scrollProgress }}
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
      />

      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
        <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full -top-20 -left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-600/25 blur-[120px] rounded-full bottom-5 right-5"></div>
      </div>

      <div className="px-4 sm:px-6 py-6 md:py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center touch-manipulation">
                <Brain size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  Flashcard{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Studio
                  </span>
                </h1>
                <p className="text-muted-foreground max-w-xl mt-1 sm:mt-2 text-sm sm:text-base">
                  Master your knowledge with AI-powered spaced repetition
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/notes')}
              className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 touch-manipulation w-full sm:w-auto"
            >
              <ArrowLeft size={18} className="mr-2 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back to Notes</span>
            </Button>
          </motion.div>

          {flashcards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16 md:py-20"
            >
              <Card className="glass-card max-w-md mx-auto bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6 sm:p-8 md:p-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-blue-700/30">
                    <Brain size={32} className="text-blue-300 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-200 mb-3 sm:mb-4">No Flashcards Yet</h2>
                  <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
                    Generate AI-powered flashcards from your notes to test your knowledge and improve retention.
                  </p>
                  <Button
                    onClick={generateFlashcards}
                    disabled={generating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white touch-manipulation w-full sm:w-auto"
                  >
                    {generating ? (
                      <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> <span className="text-sm sm:text-base">Generating...</span></>
                    ) : (
                      <><Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> <span className="text-sm sm:text-base">Generate Flashcards</span></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : viewMode === 'collections' ? (
            // Collections View
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Collections</h2>
                <Button
                  onClick={generateFlashcards}
                  disabled={generating}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {generating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Generate Flashcards</>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-900 border border-slate-700 hover-lift cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Brain size={24} className="text-white" />
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                            {collection.type}
                          </div>
                        </div>

                        <h3 className="font-semibold text-white mb-2 line-clamp-2">
                          Flashcards from {collection.title}
                        </h3>

                        <p className="text-sm text-white/60 mb-4">
                          {collection.totalCards} flashcards
                        </p>

                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCollection(collection);
                              setViewMode('browse');
                              setCurrentCardIndex(0);
                              setShowAnswer(false);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Browse
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCollection(collection);
                              setViewMode('study');
                              setStudyMode(true);
                              setCurrentCardIndex(0);
                              setShowAnswer(false);
                              resetStudySession();
                            }}
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Study
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Collection Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => {
                      setViewMode('collections');
                      setSelectedCollection(null);
                      setStudyMode(false);
                      setCurrentCardIndex(0);
                      setShowAnswer(false);
                    }}
                    variant="outline"
                    className="bg-white/5 border-white/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Collections
                  </Button>
                  <div>
                    <h2 className="text-2xl font-semibold">Flashcards from {selectedCollection?.title}</h2>
                    <p className="text-sm text-white/60">{selectedCollectionCards.length} flashcards</p>
                  </div>
                </div>
              </motion.div>

              {/* Study Mode Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setStudyMode(false);
                      setCurrentCardIndex(0);
                      setShowAnswer(false);
                    }}
                    variant={!studyMode ? "default" : "outline"}
                    className={!studyMode ? "bg-blue-500 hover:bg-blue-600" : ""}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Browse Mode
                  </Button>
                  <Button
                    onClick={() => {
                      setStudyMode(true);
                      setCurrentCardIndex(0);
                      setShowAnswer(false);
                      resetStudySession();
                    }}
                    variant={studyMode ? "default" : "outline"}
                    className={studyMode ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Study Mode
                  </Button>
                </div>
              </motion.div>

              {/* Study Statistics */}
              {studyMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <Card className="glass-card bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/30">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      </div>
                      <p className="text-2xl font-bold text-green-200">{studyStats.correct}</p>
                      <p className="text-xs text-green-300/70">Correct</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-700/30">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <XCircle className="w-5 h-5 text-red-300" />
                      </div>
                      <p className="text-2xl font-bold text-red-200">{studyStats.incorrect}</p>
                      <p className="text-xs text-red-300/70">Incorrect</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/30">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-blue-300" />
                      </div>
                      <p className="text-2xl font-bold text-blue-200">{accuracyPercentage}%</p>
                      <p className="text-xs text-blue-300/70">Accuracy</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/30">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-yellow-300" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-200">{studyStats.streak}</p>
                      <p className="text-xs text-yellow-300/70">Streak</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{currentCardIndex + 1} / {selectedCollectionCards.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </motion.div>

              {/* Main Flashcard Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <div className="relative max-w-2xl w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <FlipCard
                        front={
                          <div className="p-6 sm:p-8 text-center min-h-[250px] sm:min-h-[300px] flex flex-col justify-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30"></div>
                              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Question</span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed mb-4">
                              {selectedCollectionCards[currentCardIndex]?.question || 'No question available'}
                            </h2>
                            <div className="text-xs text-slate-400">
                              Card {currentCardIndex + 1} of {selectedCollectionCards.length}
                            </div>
                          </div>
                        }
                        back={
                          <div className="p-6 sm:p-8 text-center min-h-[250px] sm:min-h-[300px] flex flex-col justify-center bg-gradient-to-br from-emerald-900/90 to-green-900/90 backdrop-blur-sm border border-emerald-700/50 rounded-2xl">
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/30"></div>
                              <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Answer</span>
                            </div>
                            <p className="text-base sm:text-lg text-slate-100 leading-relaxed mb-4">
                              {selectedCollectionCards[currentCardIndex]?.answer || 'No answer available'}
                            </p>
                            <div className="text-xs text-emerald-300/70">
                              {cardResults[selectedCollectionCards[currentCardIndex]?.id] === 'correct' && '✓ Previously marked correct'}
                              {cardResults[selectedCollectionCards[currentCardIndex]?.id] === 'incorrect' && '✗ Previously marked incorrect'}
                            </div>
                          </div>
                        }
                        showBack={showAnswer}
                      />

                      {/* Study Mode Controls */}
                      {studyMode && showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row justify-center gap-4 mt-6"
                        >
                          <Button
                            onClick={() => handleCardResponse(false)}
                            variant="outline"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Incorrect
                          </Button>
                          <Button
                            onClick={() => handleCardResponse(true)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Correct
                          </Button>
                        </motion.div>
                      )}

                      {/* Delete Button */}
                      {!studyMode && (
                        <Button
                          onClick={() => deleteFlashcard(selectedCollectionCards[currentCardIndex]?.id)}
                          variant="ghost"
                          size="sm"
                          className="absolute top-4 right-4 text-red-400 hover:bg-red-500/20 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Navigation Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
              >
                <Button
                  onClick={() => {
                    setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                    setShowAnswer(false);
                  }}
                  disabled={currentCardIndex === 0}
                  variant="outline"
                  className="border-white/20 text-foreground hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {!studyMode && (
                  <Button
                    onClick={() => setShowAnswer(!showAnswer)}
                    variant="outline"
                    className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {showAnswer ? 'Hide' : 'Show'} Answer
                  </Button>
                )}

                {studyMode && (
                  <Button
                    onClick={resetStudySession}
                    variant="outline"
                    className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Session
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setCurrentCardIndex(Math.min(selectedCollectionCards.length - 1, currentCardIndex + 1));
                    setShowAnswer(false);
                  }}
                  disabled={currentCardIndex === selectedCollectionCards.length - 1}
                  variant="outline"
                  className="border-white/20 text-foreground hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              {/* Flashcard Grid (Browse Mode) */}
              {!studyMode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Flashcards from {selectedCollection?.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedCollectionCards.length} cards</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedCollectionCards.map((flashcard, index) => (
                      <motion.div
                        key={flashcard.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`group cursor-pointer transition-all duration-300 ${
                          index === currentCardIndex
                            ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-400/20'
                            : ''
                        }`}
                        onClick={() => {
                          setCurrentCardIndex(index);
                          setShowAnswer(false);
                        }}
                      >
                        <Card className={`bg-slate-900 border border-slate-700 hover-lift h-full transition-all duration-300 ${
                          cardResults[flashcard.id] === 'correct' ? 'ring-2 ring-green-400/50 bg-green-500/5' :
                          cardResults[flashcard.id] === 'incorrect' ? 'ring-2 ring-red-400/50 bg-red-500/5' :
                          'hover:bg-slate-800/30'
                        }`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full shadow-sm ${
                                  cardResults[flashcard.id] === 'correct' ? 'bg-green-400 shadow-green-400/30' :
                                  cardResults[flashcard.id] === 'incorrect' ? 'bg-red-400 shadow-red-400/30' :
                                  'bg-blue-400 shadow-blue-400/30'
                                }`}></div>
                                <span className="text-xs text-slate-400 font-medium">
                                  Card {index + 1}
                                </span>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFlashcard(flashcard.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>

                            <h3 className="font-semibold text-slate-200 mb-3 line-clamp-3 group-hover:text-blue-300 transition-colors">
                              {flashcard.question}
                            </h3>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Eye className="w-3 h-3" />
                                <span>Click to study</span>
                              </div>
                              {cardResults[flashcard.id] && (
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  cardResults[flashcard.id] === 'correct'
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {cardResults[flashcard.id] === 'correct' ? '✓ Correct' : '✗ Incorrect'}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;