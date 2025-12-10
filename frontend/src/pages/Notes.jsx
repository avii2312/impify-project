import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Search,
  Grid3X3,
  List,
  Plus,
  Filter,
  FileText,
  Calendar,
  Clock,
  Trash2,
  Eye,
  MoreVertical,
  Sparkles,
  BookOpen,
  X,
  ChevronRight
} from "lucide-react";

// Get icon based on note type
const getNoteTypeIcon = (type) => {
  switch (type) {
    case 'lecture': return BookOpen;
    case 'summary': return FileText;
    case 'flashcard': return Sparkles;
    default: return FileText;
  }
};

// Get gradient based on note type
const getNoteTypeGradient = (type) => {
  switch (type) {
    case 'lecture': return 'from-blue-500 to-indigo-500';
    case 'summary': return 'from-emerald-500 to-teal-500';
    case 'flashcard': return 'from-purple-500 to-pink-500';
    default: return 'from-slate-500 to-slate-600';
  }
};

// Note card component
const NoteCard = ({ note, index, onDelete, onView, viewMode }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const Icon = getNoteTypeIcon(note.note_type);
  const gradient = getNoteTypeGradient(note.note_type);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    navigate(`/note/${note.id || note._id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={handleClick}
        className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all cursor-pointer"
      >
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{note.title || 'Untitled'}</h3>
          <p className="text-sm text-white/40 truncate mt-0.5">
            {note.content?.slice(0, 100) || 'No preview available'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/30">
            {formatDate(note.created_at || note.createdAt)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id || note._id, e);
            }}
            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="group relative cursor-pointer"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

      {/* Card */}
      <div className="relative h-full p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 overflow-hidden">
        {/* Decorative corner gradient */}
        <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`} />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Icon size={18} className="text-white" />
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
            >
              <MoreVertical size={16} className="text-white/50" />
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-1 py-1 w-36 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-10"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id || note._id, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2">
          {note.title || 'Untitled Note'}
        </h3>

        <p className="text-sm text-white/40 line-clamp-3 mb-4">
          {note.content?.slice(0, 150) || 'No preview available'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Calendar size={12} />
            {formatDate(note.created_at || note.createdAt)}
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-gradient-to-r ${gradient} bg-opacity-20 text-white/70`}>
            {note.note_type || 'Note'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Empty state component
const EmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl" />
      <div className="relative w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
        <FolderOpen size={40} className="text-white/20" />
      </div>
    </div>

    <h3 className="text-xl font-semibold text-white mb-2">
      {searchTerm ? 'No notes found' : 'No notes yet'}
    </h3>
    <p className="text-white/40 text-center max-w-sm mb-6">
      {searchTerm
        ? 'Try adjusting your search terms or filters'
        : 'Upload your first document to get started with AI-powered notes'
      }
    </p>

    <Button
      onClick={() => window.location.href = '/dashboard'}
      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
    >
      <Plus size={18} className="mr-2" />
      Upload Notes
    </Button>
  </motion.div>
);

const Notes = () => {
  const navigate = useNavigate();
  const { notes, refreshData } = useDashboardData();
  const { deleteFile } = useFileUpload();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleDeleteNote = async (noteId, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this note?')) {
      const success = await deleteFile(noteId);
      if (success) {
        refreshData();
      }
    }
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes || [];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.title?.toLowerCase().includes(term) ||
        note.content?.toLowerCase().includes(term)
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(note => note.note_type === filterType);
    }

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        case 'oldest':
          return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, searchTerm, sortBy, filterType]);

  const noteTypes = ['all', 'lecture', 'summary', 'flashcard'];

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />
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
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <FolderOpen size={28} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">My Notes</h1>
              <p className="text-white/50 mt-1">
                {filteredAndSortedNotes.length} {filteredAndSortedNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
          >
            <Plus size={18} className="mr-2" />
            Upload New
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 transition-colors"
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

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Filter dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                      filterType !== 'all'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.05]'
                    }`}
                  >
                    <Filter size={18} />
                    <span className="hidden sm:inline capitalize">{filterType}</span>
                    <ChevronRight size={16} className={`transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 py-2 w-40 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-20"
                      >
                        {noteTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setFilterType(type);
                              setShowFilters(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm capitalize transition-colors ${
                              filterType === type
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'text-white/70 hover:bg-white/10'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/70 focus:outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title</option>
                </select>

                {/* View toggle */}
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.05]'
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.05]'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notes Grid/List */}
        {filteredAndSortedNotes.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }
          >
            {filteredAndSortedNotes.map((note, idx) => (
              <NoteCard
                key={note.id || note._id}
                note={note}
                index={idx}
                onDelete={handleDeleteNote}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notes;