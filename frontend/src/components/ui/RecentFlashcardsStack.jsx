import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";

function RecentFlashcardsStack({ flashcards }) {
  const navigate = useNavigate();

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Recent Flashcards</h3>
          <p className="text-muted-foreground">Generate flashcards from your notes to see them here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center overflow-visible card-stack-container">
      {flashcards.slice(0, 5).map((flashcard, i) => {
        return (
          <motion.div
            key={flashcard.id}
            className="absolute w-[260px] h-[180px] p-4 rounded-2xl shadow-xl bg-slate-900 border border-slate-700 cursor-pointer select-none"
            initial={{ rotate: -2 + i * 1, y: i * 6, opacity: 1 - i * 0.1 }}
            whileHover={{ y: -8 - (i * 2), scale: 1.02, transition: { duration: 0.2 } }}
            style={{
              zIndex: 10 - i,
            }}
            onClick={() => navigate('/flashcards')}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  borderColor: '#3b82f6'
                }}
              >
                <Brain className="w-3 h-3" />
                Flashcard
              </span>
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
              {flashcard.question || 'Flashcard Question'}
            </p>

            {/* Answer Preview */}
            <p className="text-xs text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
              {flashcard.answer?.slice(0, 100) || 'Answer will be revealed when studying...'}
            </p>

          </motion.div>
        );
      })}
    </div>
  );
}

export { RecentFlashcardsStack };