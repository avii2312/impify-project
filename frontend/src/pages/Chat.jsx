import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Loader,
  FileText,
  FileQuestion,
  MessageSquare,
  Bot,
  User,
  ArrowLeft,
  MoreVertical,
  Copy,
  RotateCcw,
  Zap,
  Brain,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { ENDPOINTS } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';
import { ensureSelectedNoteOrReject, checkTokenValidity } from '@/api/authHelpers';
import usePreventDoubleClick from '@/hooks/usePreventDoubleClick';
import MessageList from '@/components/Chat/MessageList';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const preventDoubleClick = usePreventDoubleClick();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "👋 Hello! I'm your AI study assistant. I can help you understand your notes, answer questions, and generate study materials. Try asking me something about your uploaded documents!",
      timestamp: new Date().toISOString(),
      type: "greeting"
    }
  ]);
  const [input, setInput] = useState("");
  const [userNotes, setUserNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNotes, setIsFetchingNotes] = useState(true);
  const [attachContext, setAttachContext] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState({});
  const [chatStarted, setChatStarted] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    fetchUserNotes();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle mobile keyboard
  useEffect(() => {
    const handleResize = () => {
      // Scroll to bottom when keyboard appears/disappears
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserNotes = async () => {
    try {
      setIsFetchingNotes(true);
      const response = await axiosInstance.get(ENDPOINTS.notes);
      setUserNotes(response.data.notes || []);
      if (response.data.notes && response.data.notes.length > 0) {
        setSelectedNote(response.data.notes[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      toast.error('Failed to load your notes');
    } finally {
      setIsFetchingNotes(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleNoteSelect = (noteId) => {
    setSelectedNote(noteId);
    setChatStarted(true);
    toast.success('Note selected! You can now start chatting.');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Security checks
    try {
      ensureSelectedNoteOrReject(selectedNote);
      checkTokenValidity(user);
    } catch (error) {
      toast.error(error.message);
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
      type: "message"
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    // Auto-resize textarea back to single line
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const contextNote = userNotes.find(n => n.id === selectedNote);
      const payload = {
        message: currentInput,
        note_id: attachContext && selectedNote ? selectedNote : null,
        temperature: 0.0, // Add temperature control
        top_k: 5 // Add top_k control
      };

      // Use chat endpoint for file-specific chat
      const response = await axiosInstance.post(ENDPOINTS.chat, payload);

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString(),
        type: "message",
        contextUsed: response.data.context_used && contextNote ? contextNote.title : null,
        usedChunks: response.data.used_chunks || []
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Response generated');
    } catch (error) {
      console.error('Chat error:', error);

      // Handle specific error cases
      let errorContent = "Sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
      let toastMessage = 'Failed to get AI response';

      if (error.response) {
        if (error.response.status === 402 && error.response.data && error.response.data.error === "no_tokens") {
          // Handle token limit exceeded
          errorContent = "You've reached your daily chat limit. Spend tokens to continue chatting or upgrade to Premium for unlimited access.";
          toastMessage = 'Daily limit reached';
        } else if (error.response.status === 400 && error.response.data && error.response.data.response) {
          // Handle validation errors (like missing note_id)
          errorContent = error.response.data.response;
          toastMessage = 'Please select a document first';
        } else if (error.response.data && error.response.data.error) {
          errorContent = error.response.data.error;
        }
      }

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: errorContent,
        timestamp: new Date().toISOString(),
        type: "message",
        contextUsed: null
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error(toastMessage);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: "assistant",
      content: "👋 Hello! I'm your AI study assistant. I can help you understand your notes, answer questions, and generate study materials. Try asking me something about your uploaded documents!",
      timestamp: new Date().toISOString(),
      type: "greeting"
    }]);
    toast.success('Chat cleared');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-3 sm:p-4 border-b border-white/10 backdrop-blur-xl bg-white/5"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 touch-manipulation"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <img src="/logo.png" alt="Impify" className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-sm sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Study Assistant
                </h1>
                <p className="text-xs sm:text-sm text-white/60 hidden sm:block">Powered by advanced AI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              onClick={() => setShowContextPanel(true)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 touch-manipulation"
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 touch-manipulation">
                  <MoreVertical size={18} className="sm:w-5 sm:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800/95 border-white/10">
                <DropdownMenuItem onClick={clearChat} className="text-white/80 hover:bg-white/10">
                  <RotateCcw size={16} className="mr-2" />
                  Clear Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      {/* Main Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* File Selection Screen */}
        {!chatStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="text-center max-w-2xl w-full">
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <FileText size={40} className="text-white" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Select Study Material
              </h2>

              <p className="text-white/70 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed max-w-lg mx-auto">
                Choose a document or question paper to start chatting with AI about your study materials.
              </p>

              {isFetchingNotes ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                  <span className="ml-3 text-white/70">Loading your notes...</span>
                </div>
              ) : userNotes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-2xl p-8 sm:p-12 border border-white/10"
                >
                  <FileText className="w-16 h-16 text-slate-500 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-white mb-3">No Study Materials Found</h3>
                  <p className="text-white/60 mb-6">Upload some notes or question papers to get started with AI chat.</p>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Upload Notes
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-4 sm:gap-6 max-w-4xl mx-auto">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Study Materials</h3>
                  </div>

                  <div className="grid gap-3 sm:gap-4">
                    {userNotes.map((note, index) => (
                      <motion.button
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleNoteSelect(note.id)}
                        className="w-full text-left p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/50 transition-all group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              note.note_type === 'question_paper'
                                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                                : 'bg-gradient-to-br from-blue-500 to-purple-600'
                            } shadow-lg group-hover:shadow-xl transition-shadow`}>
                              {note.note_type === 'question_paper' ? (
                                <FileQuestion size={24} className="text-white" />
                              ) : (
                                <FileText size={24} className="text-white" />
                              )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-lg mb-2 group-hover:text-blue-300 transition-colors">
                                  {note.title}
                                </h4>
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                    note.note_type === 'question_paper'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  }`}>
                                    {note.note_type === 'question_paper' ? '📝 Question Paper' : '📄 Study Notes'}
                                  </span>
                                  <span className="text-sm text-white/50">
                                    {formatDate(note.created_at)}
                                  </span>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">
                                  Click to start chatting about this document with AI
                                </p>
                              </div>

                              <div className="flex-shrink-0 ml-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MessageSquare size={16} className="text-blue-300" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Chat Interface */}
        {chatStarted && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Welcome Screen */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center max-w-lg px-2">
                    <motion.div
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/25"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Brain size={32} className="text-white sm:w-10 sm:h-10 md:w-[40px] md:h-[40px]" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Welcome to AI Study Assistant</h2>
                    <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
                      I'm here to help you understand your notes, answer questions, and accelerate your learning journey.
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {[
                        { icon: MessageSquare, title: "Explain Concepts", desc: "Get detailed explanations", color: "blue" },
                        { icon: Zap, title: "Practice Questions", desc: "Test your understanding", color: "green" },
                        { icon: FileText, title: "Quick Summary", desc: "Condense information", color: "purple" },
                        { icon: Brain, title: "Study Plan", desc: "Organize learning", color: "amber" }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className={`bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer touch-manipulation`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          onClick={() => setInput(item.title.toLowerCase().replace(' ', ' '))}
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-${item.color}-500/20 flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                            <item.icon className={`text-${item.color}-400 sm:w-6 sm:h-6`} size={16} />
                          </div>
                          <h3 className="text-white font-semibold text-xs sm:text-sm mb-1">{item.title}</h3>
                          <p className="text-white/60 text-xs">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Messages with Virtualization */}
              {messages.length > 1 && <MessageList messages={messages} />}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start mt-4"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <motion.div
                        className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot size={20} className="text-white" />
                      </motion.div>
                      <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-3xl rounded-bl-md shadow-xl backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-white/70 font-medium">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

        {/* Input Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-3 sm:p-4 md:p-6 border-t border-white/10 backdrop-blur-xl bg-white/5"
        >
          <div className="bg-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-white/20 shadow-xl">
            <div className="flex items-end gap-2 sm:gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about your notes..."
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  className="min-h-[44px] sm:min-h-[50px] max-h-32 resize-none bg-transparent border-0 text-white placeholder:text-white/50 focus:ring-0 focus:outline-none text-sm sm:text-base leading-relaxed pr-10 sm:pr-12"
                  rows={1}
                />
                <Button
                  onClick={() => setShowContextPanel(true)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-7 w-7 sm:h-8 sm:w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 touch-manipulation"
                >
                  <FileText size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => preventDoubleClick(handleSend)}
                  disabled={!input.trim() || isLoading}
                  className="h-11 w-11 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 touch-manipulation"
                >
                  {isLoading ? (
                    <Loader size={18} className="animate-spin sm:w-5 sm:h-5" />
                  ) : (
                    <Send size={18} className="sm:w-5 sm:h-5" />
                  )}
                </Button>
              </motion.div>
            </div>

            {selectedNote && attachContext && (
              <div className="flex items-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-blue-500/20 rounded-xl sm:rounded-2xl border border-blue-500/30">
                <Sparkles size={14} className="text-blue-300 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm text-blue-300 font-medium">Context attached</span>
              </div>
            )}
          </div>
        </motion.div>
      </>
      )}
      </div>

      {/* Context Panel Modal */}
      <AnimatePresence>
        {showContextPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowContextPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Study Materials</h3>
                  <Button
                    onClick={() => setShowContextPanel(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <X size={20} />
                  </Button>
                </div>
                <p className="text-white/60 text-sm mt-1">Select context for AI responses</p>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {isFetchingNotes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
                ) : userNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No notes uploaded yet</p>
                    <Button onClick={() => navigate('/dashboard')} variant="outline">
                      Upload Notes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userNotes.map((note) => (
                      <motion.button
                        key={note.id}
                        onClick={() => {
                          handleNoteSelect(note.id);
                          setShowContextPanel(false);
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all border ${
                          selectedNote === note.id
                            ? 'bg-blue-500/20 border-blue-400/50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0">
                            {note.note_type === 'question_paper' ? (
                              <FileQuestion size={18} className="text-amber-400" />
                            ) : (
                              <FileText size={18} className="text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{note.title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                note.note_type === 'question_paper'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {note.note_type === 'question_paper' ? 'Question Paper' : 'Study Notes'}
                              </span>
                              <span className="text-xs text-white/50">
                                {formatDate(note.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {selectedNote && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attachContext}
                        onChange={(e) => setAttachContext(e.target.checked)}
                        className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500/50"
                      />
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-blue-400" />
                        <span className="text-sm font-medium text-white">Attach Context</span>
                      </div>
                    </label>
                    {attachContext && (
                      <div className="mt-3 ml-8 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <p className="text-xs text-blue-300 font-medium">
                          📄 {userNotes.find(n => n.id === selectedNote)?.title}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;