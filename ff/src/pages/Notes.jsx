import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { NoteCard } from "@/components/dashboard/NoteCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Search,
  Grid3X3,
  List,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Notes = () => {
   const { notes, refreshData } = useDashboardData();
   const { deleteFile } = useFileUpload();

   const [searchTerm, setSearchTerm] = useState('');
   const [sortBy, setSortBy] = useState('newest');
   const [viewMode, setViewMode] = useState('grid');

  const handleDeleteNote = async (noteId, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      const success = await deleteFile(noteId);
      if (success) {
        // Refresh the notes list after successful deletion
        refreshData();
      }
    }
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [notes, searchTerm, sortBy]);


  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 -z-20 pointer-events-none opacity-40">
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-purple-600/20 blur-[80px] md:blur-[100px] rounded-full -top-16 md:-top-20 -left-8 md:-left-10"></div>
        <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-600/25 blur-[80px] md:blur-[120px] rounded-full bottom-4 md:bottom-5 right-4 md:right-5"></div>
      </div>

      <div className="px-4 sm:px-6 py-6 md:py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center touch-manipulation">
                <FolderOpen size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground drop-shadow-sm">
                  My Notes
                </h1>
                <p className="text-muted-foreground max-w-xl mt-1 sm:mt-2 text-sm sm:text-base">
                  All your study materials organized by topic
                </p>
              </div>
            </div>
          </motion.div>


          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 bento-glass border border-white/10 shadow-xl">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Search Section */}
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center touch-manipulation">
                    <Search size={20} className="text-white/70 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 bg-transparent text-white placeholder:text-white/50 text-base sm:text-lg focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-36 bg-white/5 border-white/20 text-white touch-manipulation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex bg-white/5 border border-white/20 rounded-xl overflow-hidden">
                    <Button
                      onClick={() => setViewMode('grid')}
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className={`flex-1 rounded-none px-3 sm:px-4 py-2 touch-manipulation ${viewMode === 'grid' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-white/10'}`}
                    >
                      <Grid3X3 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                    <Button
                      onClick={() => setViewMode('list')}
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className={`flex-1 rounded-none px-3 sm:px-4 py-2 touch-manipulation ${viewMode === 'list' ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-white/10'}`}
                    >
                      <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notes Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {filteredAndSortedNotes.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FolderOpen size={32} className="text-muted-foreground opacity-50 sm:w-12 sm:h-12 md:w-[48px] md:h-[48px]" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                    No notes found
                  </h2>
                  <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'Upload your first document to get started'
                    }
                  </p>
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-500 hover:bg-blue-600 touch-manipulation text-sm sm:text-base"
                  >
                    <Plus size={16} className="mr-2 sm:w-4 sm:h-4" />
                    Upload Notes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-3 sm:gap-4 md:gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {filteredAndSortedNotes.map((note, idx) => (
                  <motion.div
                    key={note.id || note._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NoteCard
                      note={note}
                      index={idx}
                      onDelete={handleDeleteNote}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Notes;