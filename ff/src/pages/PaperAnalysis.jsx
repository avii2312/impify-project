import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { ENDPOINTS } from "@/api/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, FileQuestion, ArrowLeft, BarChart3, BookOpen, Target } from "lucide-react";

export default function PaperAnalysis() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch notes and filter for question papers
      // In a real implementation, there might be a separate analysis endpoint
      const response = await axiosInstance.get(ENDPOINTS.notes);
      const questionPapers = response.data.notes.filter(note => note.note_type === 'question_paper');
      setAnalyses(questionPapers);
    } catch (error) {
      console.error('Failed to fetch analyses:', error);
      toast.error('Failed to load paper analyses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white text-lg">Loading paper analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Paper Analysis</h1>
            <p className="text-slate-400">AI-powered analysis of your question papers</p>
          </div>
          <Button
            onClick={() => navigate('/notes')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
        </div>

        {analyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileQuestion className="w-24 h-24 text-slate-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No Paper Analyses Yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Upload question papers to get AI-powered analysis and insights.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3"
            >
              Upload Papers
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/note/${analysis.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <FileQuestion className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
                    Question Paper
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {analysis.title}
                </h3>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {analysis.content?.substring(0, 150) || 'Analysis content not available...'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>Analyzed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Insights</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Analysis Stats */}
        {analyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileQuestion className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{analyses.length}</div>
                <div className="text-slate-400 text-sm">Papers Analyzed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">AI-Powered</div>
                <div className="text-slate-400 text-sm">Analysis Engine</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">Detailed</div>
                <div className="text-slate-400 text-sm">Insights</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}