import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, X } from "lucide-react";
import axiosInstance from "@/api/axios";
import { ENDPOINTS } from "@/api/api";
import { toast } from "sonner";

const UploadModal = ({ open = false, onOpenChange = () => {}, onUploadSuccess }) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    const form = new FormData();
    form.append("file", file);

    try {
      setUploading(true);
      const res = await axiosInstance.post(ENDPOINTS.notesUpload, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      toast.success("File uploaded successfully!");
      onOpenChange(false);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return open ? (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900/90 backdrop-blur-xl rounded-2xl z-70 w-full max-w-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <UploadCloud className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-200">Upload Document</h3>
                <p className="text-sm text-slate-400">Upload and organize your study materials</p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-8 text-center hover:border-slate-500/70 transition-colors">
              <UploadCloud className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-slate-300 mb-2 text-lg">Drop your file here or click to browse</p>
              <p className="text-slate-500 text-sm mb-4">Supports PDF, DOC, DOCX, TXT files up to 50MB</p>
              <input
                type="file"
                ref={inputRef}
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                Choose File
              </button>
              {uploading && (
                <div className="mt-4">
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-400">Uploading... {progress}%</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  ) : null;
};

export default UploadModal;