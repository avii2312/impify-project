import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, FileQuestion } from "lucide-react";

function RecentNotesStack({ notes }) {
  const navigate = useNavigate();

  const getBadgeConfig = (note) => {
    const isQuestionPaper = note.note_type === 'question_paper';
    return {
      bgColor: isQuestionPaper ? 'rgba(244, 114, 182, 0.2)' : 'rgba(0, 255, 65, 0.2)',
      textColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      borderColor: isQuestionPaper ? '#f472b6' : 'var(--matrix-green)',
      icon: isQuestionPaper ? FileQuestion : FileText,
      label: isQuestionPaper ? 'Question Paper' : 'General Notes'
    };
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Recent Notes</h3>
          <p className="text-muted-foreground">Upload some documents to see your notes here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center overflow-visible card-stack-container">
      {notes.slice(0, 5).map((note, i) => {
        const { bgColor, textColor, borderColor, icon: Icon, label } = getBadgeConfig(note);

        return (
          <motion.div
            key={note.id}
            className="absolute w-[260px] h-[180px] p-4 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/10 cursor-pointer select-none"
            initial={{ rotate: -2 + i * 1, y: i * 6, opacity: 1 - i * 0.1 }}
            whileHover={{ y: -8 - (i * 2), scale: 1.02, transition: { duration: 0.2 } }}
            style={{
              zIndex: 10 - i,
            }}
            onClick={() => navigate(`/note/${note.id}`)}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderColor: borderColor
                }}
              >
                <Icon className="w-3 h-3" />
                {label}
              </span>
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
              {note.title || 'Untitled Note'}
            </p>

            {/* Preview */}
            <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
              {note.preview || note.content?.slice(0, 120) || 'No content available...'}
            </p>

            {/* Click hint */}
            <div className="text-right">
              <span className="text-primary text-sm">Click to view →</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export { RecentNotesStack };