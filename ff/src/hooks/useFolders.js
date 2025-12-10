import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/api/axios';
import { ENDPOINTS } from '@/api/api';
import { toast } from 'sonner';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all folders
  const fetchFolders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(ENDPOINTS.folders);
      setFolders(response.data.folders || []);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new folder
  const createFolder = useCallback(async (folderData) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.folders, folderData);
      setFolders(prev => [...prev, response.data.folder]);
      toast.success('Folder created successfully');
      return response.data.folder;
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
      throw error;
    }
  }, []);

  // Update a folder
  const updateFolder = useCallback(async (folderId, folderData) => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.folderById(folderId), folderData);
      setFolders(prev => prev.map(folder =>
        folder.id === folderId ? response.data.folder : folder
      ));
      toast.success('Folder updated successfully');
      return response.data.folder;
    } catch (error) {
      console.error('Failed to update folder:', error);
      toast.error('Failed to update folder');
      throw error;
    }
  }, []);

  // Delete a folder
  const deleteFolder = useCallback(async (folderId) => {
    try {
      await axiosInstance.delete(ENDPOINTS.folderById(folderId));
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
      throw error;
    }
  }, []);
// Move note to folder
const moveNoteToFolder = useCallback(async (noteId, folderId) => {
  try {
    await axiosInstance.post(ENDPOINTS.folderMoveNote(folderId, noteId));
    toast.success('Note moved to folder');
  } catch (error) {
    console.error('Failed to move note:', error);
    toast.error('Failed to move note');
    throw error;
  }
}, []);

// Bulk add notes to folder
const bulkAddNotesToFolder = useCallback(async (folderId, noteIds) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.folderBulkAddNotes(folderId), {
      note_ids: noteIds
    });
    
    const { added, skipped } = response.data;
    if (added.length > 0) {
      toast.success(`Added ${added.length} notes to folder`);
    }
    if (skipped.length > 0) {
      toast.info(`Skipped ${skipped.length} notes (already in folder or not found)`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to bulk add notes:', error);
    toast.error('Failed to add notes to folder');
    throw error;
  }
}, []);

  // Get notes in a folder
  const getFolderNotes = useCallback(async (folderId) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.folderNotes(folderId));
      return response.data.notes || [];
    } catch (error) {
      console.error('Failed to fetch folder notes:', error);
      toast.error('Failed to load folder notes');
      return [];
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);
return {
  folders,
  loading,
  fetchFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  moveNoteToFolder,
  bulkAddNotesToFolder,
  getFolderNotes
};
};