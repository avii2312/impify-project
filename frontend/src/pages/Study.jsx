import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Flashcard from '@/components/Flashcard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import axiosInstance from '@/api/axios';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Target, 
  Trophy, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  SkipForward,
  SkipBack,
  Settings,
  BarChart3,
  Brain,
  Zap,
  Award,
  Star
} from 'lucide-react';

const Study = ({ user, onLogout }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyStats, setStudyStats] = useState({
    total: 0,
    reviewed: 0,
    correct: 0,
    streak: 0,
    accuracy: 0,
    timeSpent: 0
  });
  const [studyMode, setStudyMode] = useState('review'); // review, learning, difficult
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetchFlashcards();
    loadStudyStats();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockFlashcards = [
        {
          id: 1,
          question: "What is the primary function of mitochondria in eukaryotic cells?",
          answer: "Mitochondria are the powerhouses of the cell, responsible for cellular respiration and ATP production through oxidative phosphorylation.",
          difficulty_score: 0.3,
          review_count: 5,
          correct_ratio: 0.8,
          subject: "Biology"
        },
        {
          id: 2,
          question: "Explain the law of supply and demand in economics.",
          answer: "The law of supply and demand states that the price of a good or service is determined by the relationship between its availability (supply) and consumer desire (demand). When demand exceeds supply, prices tend to rise, and when supply exceeds demand, prices tend to fall.",
          difficulty_score: 0.5,
          review_count: 8,
          correct_ratio: 0.7,
          subject: "Economics"
        },
        {
          id: 3,
          question: "What are the four fundamental forces in physics?",
          answer: "The four fundamental forces are: 1) Gravitational force (weakest but acts over infinite distance), 2) Electromagnetic force (stronger, acts between charged particles), 3) Weak nuclear force (responsible for radioactive decay), 4) Strong nuclear force (strongest, holds atomic nuclei together).",
          difficulty_score: 0.7,
          review_count: 12,
          correct_ratio: 0.6,
          subject: "Physics"
        },
        {
          id: 4,
          question: "How does photosynthesis convert light energy into chemical energy?",
          answer: "Photosynthesis converts light energy into chemical energy through two main stages: 1) Light-dependent reactions (photolysis) in thylakoids where light energy splits water and releases oxygen, 2) Light-independent reactions (Calvin cycle) in stroma where CO2 is fixed into glucose using ATP and NADPH from the first stage.",
          difficulty_score: 0.8,
          review_count: 15,
          correct_ratio: 0.5,
          subject: "Biology"
        }
      ];
      
      setFlashcards(mockFlashcards);
      setStudyStats(prev => ({
        ...prev,
        total: mockFlashcards.length
      }));
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const loadStudyStats = () => {
    const saved = localStorage.getItem('study-stats');
    if (saved) {
      setStudyStats(JSON.parse(saved));
    }
  };

  const saveStudyStats = (stats) => {
    localStorage.setItem('study-stats', JSON.stringify(stats));
  };

  const startStudySession = () => {
    setSessionStarted(true);
    setSessionStartTime(Date.now());
    setIsPaused(false);
    toast.success('Study session started!');
  };

  const pauseStudySession = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setSessionStartTime(Date.now());
      toast.success('Session resumed');
    } else {
      toast.success('Session paused');
    }
  };

  const endStudySession = () => {
    if (sessionStartTime) {
      const sessionTime = Date.now() - sessionStartTime;
      const newStats = {
        ...studyStats,
        timeSpent: studyStats.timeSpent + sessionTime
      };
      setStudyStats(newStats);
      saveStudyStats(newStats);
    }
    setSessionStarted(false);
    setSessionStartTime(null);
    setCurrentIndex(0);
    toast.success('Study session ended! Great work!');
  };

  const handleReview = async (wasCorrect) => {
    const flashcard = flashcards[currentIndex];
    const newStats = {
      ...studyStats,
      reviewed: studyStats.reviewed + 1,
      correct: wasCorrect ? studyStats.correct + 1 : studyStats.correct,
      streak: wasCorrect ? studyStats.streak + 1 : 0,
      accuracy: Math.round(((studyStats.correct + (wasCorrect ? 1 : 0)) / (studyStats.reviewed + 1)) * 100)
    };
    
    setStudyStats(newStats);
    saveStudyStats(newStats);

    // Move to next flashcard
    if (currentIndex < flashcards.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1000);
    } else {
      toast.success('Session complete! You\'ve reviewed all flashcards.');
      endStudySession();
    }

    // API call to update flashcard stats
    try {
      await axiosInstance.post(`/api/flashcards/${flashcard.id}/review`, {
        correct: wasCorrect
      });
    } catch (error) {
      console.error('Failed to update flashcard stats:', error);
    }
  };

  const skipFlashcard = (direction) => {
    if (direction === 'forward' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'back' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Animation variants
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
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const flashcardVariants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      rotateY: 45
    },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      x: -100,
      rotateY: -45,
      transition: {
        duration: 0.4
      }
    }
  };

  const progress = flashcards.length > 0 ? (currentIndex / flashcards.length) * 100 : 0;
  const currentFlashcard = flashcards[currentIndex];
  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-muted-foreground">Loading flashcards...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="overflow-auto">
        <motion.div
          ref={ref}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold text-foreground mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Study Session
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Review and master your flashcards with spaced repetition
                  </motion.p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats and Controls */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
          >
            {/* Study Progress */}
            <motion.div variants={statsVariants}>
              <Card className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Progress</h3>
                    <p className="text-sm text-muted-foreground">{currentIndex + 1} of {flashcards.length}</p>
                  </div>
                </div>
                <Progress value={progress} className="mb-2" />
                <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
              </Card>
            </motion.div>

            {/* Accuracy */}
            <motion.div variants={statsVariants}>
              <Card className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Accuracy</h3>
                    <p className="text-sm text-muted-foreground">{studyStats.accuracy}% correct</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {studyStats.streak} streak
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* Study Time */}
            <motion.div variants={statsVariants}>
              <Card className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Time</h3>
                    <p className="text-sm text-muted-foreground">
                      {sessionStarted && sessionStartTime && !isPaused 
                        ? Math.floor((Date.now() - sessionStartTime) / 60000) 
                        : Math.floor(studyStats.timeSpent / 60000)
                      } min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    {sessionStarted && !isPaused ? 'Active' : 'Ready'}
                  </span>
                </div>
              </Card>
            </motion.div>

            {/* Controls */}
            <motion.div variants={statsVariants}>
              <Card className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Controls</h3>
                    <p className="text-sm text-muted-foreground">Session management</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!sessionStarted ? (
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={startStudySession}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={pauseStudySession}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={endStudySession}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Study Mode Selection */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <Card className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Study Mode</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: 'review', label: 'Review', desc: 'Standard review mode', icon: BookOpen },
                  { value: 'learning', label: 'Learning', desc: 'Focus on new cards', icon: Brain },
                  { value: 'difficult', label: 'Difficult', desc: 'Practice hard cards', icon: Target }
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <motion.button
                      key={mode.value}
                      className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                        studyMode === mode.value 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary/50 text-foreground'
                      }`}
                      onClick={() => setStudyMode(mode.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-sm opacity-70">{mode.desc}</div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Flashcard */}
          <AnimatePresence mode="wait">
            {currentFlashcard && sessionStarted && !isPaused && (
              <motion.div
                key={currentIndex}
                variants={flashcardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="max-w-2xl mx-auto"
              >
                <Flashcard
                  flashcard={currentFlashcard}
                  onReview={handleReview}
                  showAnswer={true}
                  disableInteractions={false}
                  className="mb-8"
                  isMobile={isMobile}
                />
                
                {/* Navigation */}
                <motion.div 
                  className="flex justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => skipFlashcard('back')}
                    disabled={currentIndex === 0}
                    className="button-dark px-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SkipBack className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => skipFlashcard('forward')}
                    disabled={currentIndex === flashcards.length - 1}
                    className="button-dark px-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <SkipForward className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No flashcards or not started */}
          {(!currentFlashcard || !sessionStarted) && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                {sessionStarted ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BookOpen className="w-10 h-10 text-white" />
                  </motion.div>
                ) : (
                  <Play className="w-10 h-10 text-white" />
                )}
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {sessionStarted ? 'Session Paused' : 'Ready to Study?'}
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground mb-8 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {!sessionStarted 
                  ? 'Click "Start" to begin your study session with personalized flashcards.'
                  : 'Click the play button to continue your study session.'
                }
              </motion.p>
              
              {!sessionStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                    onClick={startStudySession}
                    disabled={flashcards.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Study Session
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Study Complete */}
          {currentIndex >= flashcards.length && sessionStarted && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">Session Complete!</h3>
              <p className="text-muted-foreground mb-8">Great job! You've reviewed all your flashcards.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{studyStats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{studyStats.streak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{Math.floor(studyStats.timeSpent / 60000)}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                onClick={startStudySession}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Study Again
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Study;