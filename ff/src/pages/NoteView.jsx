import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import axiosInstance from '@/api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ArrowLeft, Download, Loader2, BookOpen, Copy, Check, FileText, Brain, Plus, Eye, Trash2, BookText, Code, Quote, List, Hash, ChevronDown, BarChart3, FileQuestion } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ENDPOINTS } from '@/api/api';
import Flashcard from '@/components/Flashcard';

export default function NoteView() {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [generatingCards, setGeneratingCards] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [exportingAnalysis, setExportingAnalysis] = useState(false);

  // Scroll progress for reading progress bar
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    fetchNote();
    fetchFlashcards();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.notesById(noteId));
      setNote(response.data.note);
    } catch (error) {
      toast.error('Failed to load note');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async () => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.flashcards, {
        params: { note_id: noteId }
      });
      setFlashcards(response.data.flashcards || []);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
    }
  };

  const handleExport = async (format = 'txt') => {
    setExporting(true);
    try {
      const response = await axiosInstance.get(ENDPOINTS.notesExport(noteId) + `?format=${format}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note?.title || 'note'}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Note exported as ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error('Failed to export note');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note?.content || '');
    setCopied(true);
    toast.success('Content copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateFlashcards = async () => {
    if (flashcards.length > 0) {
      toast.info('Flashcards already exist for this note');
      return;
    }

    setGeneratingCards(true);
    try {
      const response = await axiosInstance.post(ENDPOINTS.flashcardsGenerate, {
        note_id: noteId,
        num_cards: 8
      });

      if (response.data.flashcards) {
        setFlashcards(response.data.flashcards);
        toast.success(`Generated ${response.data.flashcards.length} flashcards!`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to generate flashcards';
      toast.error(errorMsg);
    } finally {
      setGeneratingCards(false);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await axiosInstance.delete(ENDPOINTS.flashcardsDelete(flashcardId));
      setFlashcards(prev => prev.filter(card => card.id !== flashcardId));
      toast.success('Flashcard deleted');
    } catch (error) {
      toast.error('Failed to delete flashcard');
    }
  };

  const analyzePaper = async () => {
    if (analysis) {
      toast.info('Paper already analyzed');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await axiosInstance.post('/api/papers/analyze', {
        document_id: noteId
      });
      setAnalysis(response.data);
      toast.success('Paper analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze paper');
    } finally {
      setAnalyzing(false);
    }
  };

  const exportAnalysis = async () => {
    setExportingAnalysis(true);
    try {
      const response = await axiosInstance.post('/api/papers/analyze', {
        document_id: noteId,
        format: 'pdf'
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${note?.title || 'analysis'}_analysis.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Analysis exported as PDF successfully!');
    } catch (error) {
      toast.error('Failed to export analysis');
    } finally {
      setExportingAnalysis(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white text-lg">Loading your notes...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Action Icon Component
  const ActionIcon = ({ icon: Icon, label, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center
                 rounded-xl bg-black/40 border border-white/10
                 hover:bg-white/10 transition"
      title={label}
    >
      <Icon className="text-white" size={20} />
    </motion.button>
  );

  // Custom Markdown Components
  const MarkdownComponents = {
    // Headings with different styles
    h1: ({ children }) => (
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-white mb-6 mt-8 pb-3 border-b border-gradient-to-r from-blue-500 to-purple-500 flex items-center gap-3"
      >
        <Hash className="text-blue-400" size={28} />
        {children}
      </motion.h1>
    ),
    h2: ({ children }) => (
      <motion.h2
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-semibold text-white mb-4 mt-6 flex items-center gap-2"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
        {children}
      </motion.h2>
    ),
    h3: ({ children }) => (
      <motion.h3
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xl font-medium text-blue-300 mb-3 mt-5"
      >
        {children}
      </motion.h3>
    ),

    // Paragraph with better spacing
    p: ({ children }) => (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white/90 leading-relaxed mb-4 text-lg"
      >
        {children}
      </motion.p>
    ),

    // Code blocks with syntax highlighting
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-6"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-blue-300">
            <Code size={16} />
            <span className="font-mono">{match[1]}</span>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            className="rounded-xl !bg-slate-900/90 !border !border-slate-700/50"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </motion.div>
      ) : (
        <motion.code
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/80 text-blue-300 px-2 py-1 rounded-md font-mono text-sm border border-slate-600/50"
          {...props}
        >
          {children}
        </motion.code>
      );
    },

    // Blockquotes with visual styling
    blockquote: ({ children }) => (
      <motion.blockquote
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="border-l-4 border-blue-400 bg-blue-500/10 rounded-r-lg p-4 my-6 ml-4"
      >
        <div className="flex items-start gap-3">
          <Quote className="text-blue-400 mt-1 flex-shrink-0" size={20} />
          <div className="text-blue-200 italic">
            {children}
          </div>
        </div>
      </motion.blockquote>
    ),

    // Lists with better styling
    ul: ({ children }) => (
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2 mb-6 ml-6"
      >
        {children}
      </motion.ul>
    ),

    ol: ({ children }) => (
      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2 mb-6 ml-6"
      >
        {children}
      </motion.ol>
    ),

    li: ({ children }) => (
      <motion.li
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-white/85 leading-relaxed flex items-start gap-3"
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
        <span>{children}</span>
      </motion.li>
    ),

    // Links with hover effects
    a: ({ children, href }) => (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        {children}
      </motion.a>
    ),

    // Tables with better styling
    table: ({ children }) => (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto my-6"
      >
        <table className="w-full border-collapse border border-slate-600/50 rounded-lg overflow-hidden">
          {children}
        </table>
      </motion.div>
    ),

    th: ({ children }) => (
      <th className="bg-slate-700/50 text-white font-semibold p-3 text-left border-b border-slate-600/50">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="text-white/85 p-3 border-b border-slate-600/30">
        {children}
      </td>
    ),

    // Horizontal rule
    hr: () => (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent my-8"
      />
    ),

    // Strong and emphasis
    strong: ({ children }) => (
      <strong className="text-white font-semibold">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em className="text-blue-200 italic">
        {children}
      </em>
    ),
  };

  return (
    <div className="px-6 py-8 relative">
      {/* Reading Progress Bar */}
      <motion.div
        style={{ scaleX: scrollProgress }}
        className="fixed top-0 left-0 h-[3px] bg-blue-500 origin-left z-50"
      />

      {/* Page Load Transition Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-black pointer-events-none z-[999]"
      />

      {/* Subtle Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
          className="absolute w-72 h-72 bg-purple-500/10 blur-3xl rounded-full top-10 left-20"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <Button
            onClick={() => navigate('/notes')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Notes
          </Button>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={exporting}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white mr-3"
                >
                  {exporting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" /> Export</>
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800/95 border-white/10">
                <DropdownMenuItem
                  onClick={() => handleExport('docx')}
                  className="text-white/80 hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as DOCX
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport('txt')}
                  className="text-white/80 hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export as TXT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ActionIcon icon={Copy} label="Copy Content" onClick={handleCopyContent} />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Impify</span>
          </div>
        </div>

        {/* Frosted Glass Container (Bento Card) */}
        <motion.div
          className="rounded-[32px] p-10 bg-gradient-to-br from-white/5 to-white/0
                     backdrop-blur-2xl border border-white/10 shadow-2xl
                     transition-all duration-500 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Note Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl font-semibold text-white mb-4 tracking-tight"
          >
            {note?.title || 'Untitled Note'}
          </motion.h1>

          {/* Glow Divider */}
          <div className="h-[2px] w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6" />

          {/* Enhanced Typography + Reading Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-2"
          >
            <ReactMarkdown
              components={MarkdownComponents}
              className="enhanced-markdown"
            >
              {note?.content || 'No content available'}
            </ReactMarkdown>
          </motion.div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              Created on {formatDate(note?.created_at)}
            </p>
          </div>
        </motion.div>

        {/* Flashcards Section */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Brain size={28} className="text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Flashcards</h2>
                  <p className="text-slate-400">
                    {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'} available
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {flashcards.length === 0 ? (
                  <Button
                    onClick={generateFlashcards}
                    disabled={generatingCards}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {generatingCards ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                    ) : (
                      <><Plus className="w-4 h-4 mr-2" /> Generate Flashcards</>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowFlashcards(!showFlashcards)}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showFlashcards ? 'Hide' : 'View'} Cards
                    </Button>
                    <Button
                      onClick={() => navigate('/flashcards')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Study Mode
                    </Button>
                  </>
                )}
              </div>
            </div>

            {flashcards.length === 0 ? (
              <div className="text-center py-12">
                <Brain size={64} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Flashcards Yet</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Generate AI-powered flashcards from your notes to test your knowledge and improve retention.
                </p>
                <Button
                  onClick={generateFlashcards}
                  disabled={generatingCards}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
                >
                  {generatingCards ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Plus className="w-5 h-5 mr-2" /> Generate Flashcards</>
                  )}
                </Button>
              </div>
            ) : showFlashcards && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((flashcard, index) => (
                  <div key={flashcard.id} className="relative">
                    <Flashcard
                      flashcard={flashcard}
                      showAnswer={false}
                      disableInteractions={true}
                    />
                    <Button
                      onClick={() => handleDeleteFlashcard(flashcard.id)}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-red-400 hover:bg-red-500/20 p-2 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paper Analysis Section - Only for question papers */}
        {note?.note_type === 'question_paper' && (
          <Card className="bg-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <BarChart3 size={28} className="text-blue-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Paper Analysis</h2>
                    <p className="text-slate-400">
                      AI-powered analysis of this question paper
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!analysis ? (
                    <Button
                      onClick={analyzePaper}
                      disabled={analyzing}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      {analyzing ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                      ) : (
                        <><FileQuestion className="w-4 h-4 mr-2" /> Analyze Paper</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={exportAnalysis}
                      disabled={exportingAnalysis}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      {exportingAnalysis ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                      ) : (
                        <><Download className="w-4 h-4 mr-2" /> Export as PDF</>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {analysis ? (
                <div className="space-y-6">
                  {analysis.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-6 border border-white/10"
                    >
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Question {index + 1}: {item.question}
                      </h3>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {item.analysis}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 size={64} className="text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready for Analysis</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Click "Analyze Paper" to get AI-powered insights on this question paper, including difficulty levels and solution hints.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
          <p className="text-slate-300">
            💡 <strong className="text-white">Tip:</strong> These notes were generated using advanced AI to help you study more efficiently!
          </p>
        </div>
      </div>
    </div>
  );
}