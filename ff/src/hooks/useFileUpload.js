import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { trackUpload } from '@/utils/analytics';
import { ENDPOINTS } from '@/api/api';

export const useFileUpload = (onUploadSuccess = () => {}) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const allowedTypes = [
    '.pdf', '.docx', '.doc', '.txt', '.md', '.jpg', 
    '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'
  ];

  const validateFile = useCallback((file) => {
    if (!file) {
      toast.error('No file selected');
      return false;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 50MB');
      return false;
    }

    // Check file type
    const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`File type not supported. Please use: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  }, [allowedTypes]);

  const uploadFile = useCallback(async (file, noteType = 'general') => {
    console.log('🚀 Starting file upload:', { filename: file.name, size: file.size, type: noteType });

    if (!validateFile(file)) {
      console.log('❌ File validation failed');
      return false;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Track the upload attempt
      trackUpload({ filename: file.name, size: file.size, type: noteType });
      console.log('📊 Upload tracking initiated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('note_type', noteType);

      // Simulate progress for better UX (since we can't track actual progress with axios)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axiosInstance.post(ENDPOINTS.notesUpload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      console.log('✅ Upload successful:', response.data);

      // Get the note ID from response for redirection
      const noteId = response.data?.note?.id || response.data?.id || response.data?.noteId;
      const noteUrl = noteId ? `/note/${noteId}` : '/notes';

      // Enhanced success notifications with direct note redirection
      const isQuestionPaper = noteType === 'question_paper';
      const successMessage = isQuestionPaper
        ? 'Question paper analyzed successfully! AI-generated notes and flashcards are ready.'
        : 'Study material uploaded successfully! AI-powered notes generated.';

      toast.success(successMessage, {
        description: isQuestionPaper
          ? 'Your question paper has been processed and study materials created.'
          : 'Your document has been analyzed and converted to interactive study notes.',
        duration: 5000,
        action: {
          label: noteId ? 'View Note' : 'View Notes',
          onClick: () => navigate(noteUrl)
        }
      });

      // Auto-redirect to the specific note after a short delay
      if (noteId) {
        setTimeout(() => {
          navigate(noteUrl);
        }, 2500); // Redirect after 2.5 seconds to let user see the success message
      }

      onUploadSuccess(response.data);

      return true;
    } catch (error) {
      setProgress(0);
      const errorMsg = error.response?.data?.error || 'Upload failed';
      const errorDetails = error.response?.data?.message;

      if (error.response?.status === 429) {
        toast.error(errorDetails || 'Free tier limit reached. Try again tomorrow!');
      } else if (error.response?.status === 413) {
        toast.error('File too large. Please try a smaller file.');
      } else if (error.response?.status === 415) {
        toast.error('Unsupported file format. Please try a different file.');
      } else {
        toast.error(errorMsg);
      }

      console.error('Upload error:', error);
      return false;
    } finally {
      setUploading(false);
    }
  }, [validateFile, onUploadSuccess]);

  const deleteFile = useCallback(async (noteId) => {
    try {
      await axiosInstance.delete(ENDPOINTS.notesById(noteId));
      toast.success('Note deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
      return false;
    }
  }, []);

  const handleDrop = useCallback((e, noteType = 'general') => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      return uploadFile(file, noteType);
    }
    return false;
  }, [uploadFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  return {
    uploading,
    dragOver,
    progress,
    uploadFile,
    deleteFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    setDragOver,
    allowedTypes,
    validateFile
  };
};