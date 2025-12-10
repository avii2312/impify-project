import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";

export default function FancyDropzone({ onFileSelect, uploading = false, progress = 0, error = null }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col items-center text-center transition-all duration-300 touch-manipulation ${
          dragActive
            ? "border-blue-400/50 bg-blue-500/5"
            : uploading
            ? "border-yellow-400/50 bg-yellow-500/5"
            : error
            ? "border-red-400/50 bg-red-500/5"
            : "border-white/20 hover:border-blue-400/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragActive(true);
        }}
        onDragLeave={() => {
          if (!uploading) setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) {
            setDragActive(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
          }
        }}
      >
        <motion.div
          animate={{
            scale: dragActive ? 1.1 : uploading ? 1.05 : 1,
            y: dragActive ? -4 : 0,
            rotate: uploading ? 360 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            rotate: { duration: 2, repeat: uploading ? Infinity : 0, ease: "linear" }
          }}
        >
          {uploading ? (
            <div className="relative">
              <Upload className="w-10 h-10 text-yellow-400 mb-4" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : error ? (
            <AlertCircle className="w-10 h-10 text-red-400 mb-4" />
          ) : (
            <Upload className="w-10 h-10 text-blue-400 mb-4" />
          )}
        </motion.div>

        <p className="text-white text-base sm:text-lg font-semibold mb-2">
          {uploading
            ? "Processing your file..."
            : error
            ? "Upload failed"
            : dragActive
            ? "Drop your file here!"
            : "Upload Study Material"}
        </p>

        {uploading && (
          <div className="w-full max-w-xs mb-3 sm:mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-yellow-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-yellow-400 text-xs sm:text-sm mt-2">{progress}% complete</p>
          </div>
        )}

        <p className={`text-xs sm:text-sm mb-4 sm:mb-6 ${error ? 'text-red-300' : 'text-gray-300'}`}>
          {uploading
            ? "AI is analyzing your document..."
            : error
            ? error
            : "Drag & drop or click to upload files (Max 50MB)"}
        </p>

        {!uploading && (
          <motion.button
            className={`px-6 py-3 rounded-xl text-white font-medium transition-colors ${
              error ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {error ? 'Try Again' : 'Choose File'}
          </motion.button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              onFileSelect(file);
              // Reset the input value so the same file can be selected again
              e.target.value = '';
            }
          }}
        />

        <p className="text-xs text-gray-400 mt-4">
          Supported: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, GIF, BMP, TIFF, WEBP
        </p>
      </div>
    </motion.div>
  );
}