import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';

const FileUploadZone = React.memo(({
  noteType,
  setNoteType,
  onFileUpload,
  onFileSelect,
  uploading,
  dragOver,
  setDragOver,
  fileInputRef,
  className = ''
}) => {
  const handleDrop = React.useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload, setDragOver]);

  const handleDragOver = React.useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileChange = React.useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const allowedTypes = React.useMemo(() => [
    '.pdf', '.docx', '.doc', '.txt', '.md', '.jpg',
    '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'
  ], []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className={`bg-card border border-border rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-3 mb-4" variants={itemVariants}>
        <motion.div
          className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="w-5 h-5 text-primary" />
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-foreground"
          variants={itemVariants}
        >
          Upload Study Material
        </motion.h2>
      </motion.div>
      <motion.p
        className="text-muted mb-6 text-lg"
        variants={itemVariants}
      >
        Drop your files here or click to browse. AI will analyze and create comprehensive notes from PDFs, DOCs, TXT, and images.
      </motion.p>

      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card/50 hover:bg-card/80'
        }`}
        role="button"
        tabIndex={0}
        aria-label="File upload area. Drag and drop files here or click to browse."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        animate={dragOver ? { scale: 1.02 } : { scale: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              dragOver
                ? 'bg-primary/20 border border-primary text-primary'
                : 'bg-muted/10 border border-muted text-muted'
            }`}
            animate={dragOver ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload size={32} />
          </motion.div>
          <div className="space-y-2">
            <motion.p
              className="text-xl font-semibold text-foreground"
              animate={{ scale: dragOver ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {dragOver ? 'Drop your file here' : 'Drag & drop your file'}
            </motion.p>
            <motion.p className="text-muted" variants={itemVariants}>
              or click the button below to browse (Max 50MB)
            </motion.p>
            <motion.div
              className="bg-muted/10 border border-muted rounded-lg p-3 text-sm text-muted max-w-md"
              variants={itemVariants}
            >
              <strong>Supported formats:</strong> PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, BMP, TIFF, WEBP
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-4 flex-wrap items-end mt-6"
        variants={itemVariants}
      >
        <div className="flex-1 min-w-64">
          <motion.label
            htmlFor="note-type-select"
            className="block text-sm font-medium text-foreground mb-2"
            variants={itemVariants}
          >
            Note Type
          </motion.label>
          <Select value={noteType} onValueChange={setNoteType}>
            <SelectTrigger
              id="note-type-select"
              className="h-12 border-border bg-card text-foreground rounded-lg"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Notes</SelectItem>
              <SelectItem value="question_paper">Question Paper Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Choose file to upload"
        />
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`h-12 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              uploading
                ? 'bg-secondary text-secondary-foreground cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-glow'
            }`}
            aria-label={uploading ? "Processing file" : "Choose file to upload"}
            whileHover={!uploading ? { scale: 1.05, y: -1 } : {}}
            whileTap={!uploading ? { scale: 0.95 } : {}}
          >
            {uploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                Processing...
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-5 h-5" />
                </motion.div>
                Choose File
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

FileUploadZone.displayName = 'FileUploadZone';

export { FileUploadZone };